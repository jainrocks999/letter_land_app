package com.eflashapps.eletter

import android.app.Activity
import android.app.AlertDialog
import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.IntentSenderRequest
import androidx.appcompat.app.AppCompatActivity
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.InstallStateUpdatedListener
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability

class AppController(
    private val activity:AppCompatActivity,
    private val updateLauncher: ActivityResultLauncher<IntentSenderRequest>,
){

    private val appUpdateManager: AppUpdateManager= AppUpdateManagerFactory.create(activity)

    private val installStateListener = InstallStateUpdatedListener { state -> 
      when (state.installStatus()){
        InstallStatus.DOWNLOADED -> showUpdateReadyDialog()
        InstallStatus.FAILED -> Log.w(TAG, "Update download failed")
        else -> Unit
      }
    }

    private var updateReadyDialogShown= false
    private var lastUpdatePromptMs= 0L

    fun onStart(){
      appUpdateManager.registerListener(installStateListener)
    }
    fun onStop(){
      appUpdateManager.unregisterListener(installStateListener)
    }

    fun onUpdateResult(resultCode:Int){
        if(resultCode != Activity.RESULT_OK){
            Log.w(TAG,"In-app update cancelled/failed: $resultCode")
        }
    }

    fun checkForUpdate(force: Boolean =false){
        appUpdateManager.appUpdateInfo
        .addOnSuccessListener { info -> handleAppUpdateInfo(info, force) }
        .addOnFailureListener { error -> 
          Log.w(TAG, "Update check failed", error)
        }
    }

    private fun handleAppUpdateInfo(info: AppUpdateInfo, force: Boolean){
        when {
            info.installStatus()== InstallStatus.DOWNLOADED -> {
                showUpdateReadyDialog()
            }

            info.updateAvailability() == 
            UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS -> {
             startFlexibleUpdate(info)
            }

            info.updateAvailability() ==UpdateAvailability.UPDATE_AVAILABLE && 
             info.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE) && 
             (force || 
              ((info.clientVersionStalenessDays() ?: -1) >= MIN_STALE_DAYS && 
               System.currentTimeMillis() - lastUpdatePromptMs > PROMPT_INTERVAL_MS)) -> {

              lastUpdatePromptMs = System.currentTimeMillis()
              startFlexibleUpdate(info)
            }
        }
    }

    private fun startFlexibleUpdate( info: AppUpdateInfo) {
        val options = AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build()
        val started = appUpdateManager.startUpdateFlowForResult(
            info,
            updateLauncher,
            options,
        )
        if (!started) Log.w(TAG, "Could not start update flow")
    }

    private fun showUpdateReadyDialog(){
        if (updateReadyDialogShown || activity.isFinishing || activity.isDestroyed) return
        updateReadyDialogShown = true

        AlertDialog.Builder(activity)
          .setTitle("Update ready")
          .setMessage('eLetter update downloaded. Restart now to install)
          .setCancelable(false)
          .setPositiveButton("Restart"){_, _ ->
            updateReadyDialogShown=false
            appUpdateManager.completeUpdate()
          }
          .setNegativeButton("Later") { _, _ ->
             updateReadyDialogShown= false
             appUpdateManager.completeUpdate()
          }
          .setNegativeButton("Later"){ _, _ ->
             updateReadyDialogShown = false
          }
          .show()
    }

    companion object {
        private const val TAG = "AppUpdate"
        private const val MIN_STALE_DAYS =1
        private const val PROMPT_INTERVAL_MS = 24 * 60 * 60 * 1000L
    }
}