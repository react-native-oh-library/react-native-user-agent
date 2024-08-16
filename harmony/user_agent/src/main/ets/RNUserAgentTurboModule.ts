/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import hilog from '@ohos.hilog';
import common from '@ohos.app.ability.common';
import bundleManager from '@ohos.bundle.bundleManager';
import deviceInfo from '@ohos.deviceInfo';

export class RNUserAgentTurboModule extends TurboModule implements TM.UserAgentNativeModule.Spec {
  protected context: common.UIAbilityContext;
  systemName: string = deviceInfo.distributionOSName.length === 0 ? 'OpenHarmony' : deviceInfo.distributionOSName;
  systemVersion: string = deviceInfo.osFullName.slice(0, 3);

  constructor(ctx) {
    super(ctx);
    this.context = ctx?.uiAbilityContext;
  }

  getWebViewUserAgent(): Promise<string> {
    return new Promise<string>((resolve) => {
      resolve(this.getUserAgentSync());
    });
  }

  getConstants(): Object {
    let packageName = '';
    let shortPackageName = '';
    let applicationName: string = '';
    let applicationVersion: string = '';
    let buildNumber: string = '';
    let userAgent = '';

    try {
      let bundleInfo = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      packageName = bundleInfo.name;
      shortPackageName = packageName.substring(packageName.lastIndexOf('.') + 1);
      applicationName = this.context.resourceManager.getStringSync(bundleInfo.appInfo.labelId);
      applicationVersion = bundleInfo.versionName;
      buildNumber = (bundleInfo.versionCode).toString();
      userAgent = shortPackageName + '/' + applicationVersion + '.' + buildNumber + ' ' + this.getUserAgentSync();
    } catch (error) {
      hilog.error(0x0000, 'UserAgent', '%{public}s', `getBundleInfoForSelfSync failed: ${JSON.stringify(error)}`);
    }

    return {
      systemName: this.systemName,
      systemVersion: this.systemVersion,
      packageName: packageName,
      shortPackageName: shortPackageName,
      applicationName: applicationName,
      applicationVersion: applicationVersion,
      buildNumber: buildNumber,
      userAgent: userAgent
    }
  }

  private getUserAgentSync(): string {
    let deviceType: string = deviceInfo.deviceType.charAt(0).toUpperCase() + deviceInfo.deviceType.slice(1);
    let OSName: string = this.systemName;
    let OSVersion: string = this.systemVersion;
    let ArkWebVersionCode: string = '4.1.6.1';  // 备注
    let Mobile: string = deviceType === 'Phone' ? 'Mobile' : '';

    return `Mozilla/5.0 (${deviceType}; ${OSName} ${OSVersion}) AppleWebKit/537.36 (KHTML, like Gecko) ` +
      `Chrome/114.0.0.0 Safari/537.36 ArkWeb/${ArkWebVersionCode} ${Mobile}`;
  }
}