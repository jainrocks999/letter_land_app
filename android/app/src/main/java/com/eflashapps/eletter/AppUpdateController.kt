package com.eflashapps.eletter

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.IntentSenderRequest
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.InstallStateUpdatedListener
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability

class AppUpdateController(
    private val activity: Activity,
    private val updateLauncher: ActivityResultLauncher<IntentSenderRequest>,
) {

    private val appUpdateManager: AppUpdateManager = AppUpdateManagerFactory.create(activity)
    private val prefs = activity.getSharedPreferences(PREFS_NAME, Activity.MODE_PRIVATE)

    private var flexibleRestartDialogShown = false
    private var blockingDialogShown = false
    private var lastOptionalPromptMs = 0L

    private val installStateListener = InstallStateUpdatedListener { state ->
        when (state.installStatus()) {
            InstallStatus.DOWNLOADED -> showFlexibleRestartDialog()
            InstallStatus.FAILED -> {
                Log.w(TAG, "Flexible update download failed: ${state.installErrorCode()}")
                clearInProgressType()
            }
            InstallStatus.CANCELED -> clearInProgressType()
            else -> Unit
        }
    }

    fun onStart() {
        appUpdateManager.registerListener(installStateListener)
    }

    fun onStop() {
        appUpdateManager.unregisterListener(installStateListener)
    }

    fun onUpdateResult(resultCode: Int) {
        if (resultCode == Activity.RESULT_OK) return

        Log.w(TAG, "In-app update cancelled/failed: $resultCode")
        val wasImmediate = getInProgressType() == AppUpdateType.IMMEDIATE
        clearInProgressType()

        if (wasImmediate) {
            showBlockingStoreDialog()
        }
    }

    fun checkForUpdate() {
        appUpdateManager.appUpdateInfo
            .addOnSuccessListener { info -> handleAppUpdateInfo(info) }
            .addOnFailureListener { error ->
                Log.w(TAG, "Update check failed", error)
            }
    }

    private fun handleAppUpdateInfo(info: AppUpdateInfo) {
        if (info.installStatus() == InstallStatus.DOWNLOADED) {
            showFlexibleRestartDialog()
            return
        }

        if (info.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
            if (getInProgressType() == AppUpdateType.IMMEDIATE) {
                startImmediate(info)
            } else {
                startFlexible(info)
            }
            return
        }

        if (info.updateAvailability() != UpdateAvailability.UPDATE_AVAILABLE) return

        when (UPDATE_TYPE) {
            UpdateType.FORCE -> {
                if (info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                    startImmediate(info)
                } else {
                    showBlockingStoreDialog()
                }
            }

            UpdateType.OPTIONAL -> {
                val now = System.currentTimeMillis()
                if (now - lastOptionalPromptMs < OPTIONAL_PROMPT_INTERVAL_MS) return

                if (info.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                    lastOptionalPromptMs = now
                    startFlexible(info)
                }
            }
        }
    }

    private fun startImmediate(info: AppUpdateInfo) {
        setInProgressType(AppUpdateType.IMMEDIATE)
        val started = appUpdateManager.startUpdateFlowForResult(
            info,
            updateLauncher,
            AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build(),
        )
        if (!started) {
            Log.w(TAG, "Could not start immediate update flow")
            clearInProgressType()
            showBlockingStoreDialog()
        }
    }

    private fun startFlexible(info: AppUpdateInfo) {
        setInProgressType(AppUpdateType.FLEXIBLE)
        val started = appUpdateManager.startUpdateFlowForResult(
            info,
            updateLauncher,
            AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build(),
        )
        if (!started) {
            Log.w(TAG, "Could not start flexible update flow")
            clearInProgressType()
        }
    }

    private fun showFlexibleRestartDialog() {
        if (flexibleRestartDialogShown || activity.isFinishing || activity.isDestroyed) return
        flexibleRestartDialogShown = true

        AlertDialog.Builder(activity)
            .setTitle("Update ready")
            .setMessage("eLetter update downloaded. Restart now to install.")
            .setCancelable(true)
            .setPositiveButton("Restart") { _, _ ->
                flexibleRestartDialogShown = false
                clearInProgressType()
                appUpdateManager.completeUpdate()
            }
            .setNegativeButton("Later") { _, _ ->
                flexibleRestartDialogShown = false
            }
            .show()
    }

    private fun showBlockingStoreDialog() {
        if (blockingDialogShown || activity.isFinishing || activity.isDestroyed) return
        blockingDialogShown = true

        AlertDialog.Builder(activity)
            .setTitle("Update required")
            .setMessage("A new version of eLetter is required to continue. Please update.")
            .setCancelable(false)
            .setPositiveButton("Update") { _, _ ->
                blockingDialogShown = false
                openPlayStore()
            }
            .show()
    }

    private fun openPlayStore() {
        val packageName = activity.packageName
        val marketIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName"))
        val webIntent = Intent(
            Intent.ACTION_VIEW,
            Uri.parse("https://play.google.com/store/apps/details?id=$packageName"),
        )
        try {
            activity.startActivity(marketIntent)
        } catch (_: Exception) {
            activity.startActivity(webIntent)
        }
    }

    private fun setInProgressType(type: Int) {
        prefs.edit().putInt(KEY_IN_PROGRESS_TYPE, type).apply()
    }

    private fun getInProgressType(): Int {
        return prefs.getInt(KEY_IN_PROGRESS_TYPE, AppUpdateType.FLEXIBLE)
    }

    private fun clearInProgressType() {
        prefs.edit().remove(KEY_IN_PROGRESS_TYPE).apply()
    }

    private enum class UpdateType {
        FORCE,
        OPTIONAL,
    }

    companion object {
        private const val TAG = "AppUpdate"
        private const val PREFS_NAME = "app_update_prefs"
        private const val KEY_IN_PROGRESS_TYPE = "in_progress_type"
        private const val OPTIONAL_PROMPT_INTERVAL_MS = 24 * 60 * 60 * 1000L

        // Change this per release: UpdateType.FORCE or UpdateType.OPTIONAL
        private val UPDATE_TYPE: UpdateType
            get()= if(BuildConfig.UPDATE_TYPE.equals("FORCE", ignoreCase = true)) {
                UpdateType.FORCE
            }else {
                UpdateType.OPTIONAL
            }
    }
}
