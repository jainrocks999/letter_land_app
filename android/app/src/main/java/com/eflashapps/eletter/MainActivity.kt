package com.eflashapps.eletter

import android.os.Bundle
import androidx.activity.result.contract.ActivityResultContracts
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

  private val updateLauncher =
    registerForActivityResult(ActivityResultContracts.StartIntentSenderForResult()) { result ->
      appUpdateController.onUpdateResult(result.resultCode)
    }
  
  private val appUpdateController by lazy {
     AppUpdateController(this, updateLauncher)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "eLetter"
 
  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    super.onCreate(savedInstanceState)
    appUpdateController.onStart()
  }

  override fun onResume(){
    super.onResume()
    appUpdateController.checkForUpdate()
  }

  override fun onDestroy(){
    appUpdateController.onStop()
    super.onDestroy()
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
