'use strict';

import { NativeModules, TurboModuleRegistry } from 'react-native';

const RTNUserAgent = TurboModuleRegistry ? TurboModuleRegistry.get('UserAgentNativeModule') : NativeModules.UserAgent; 
const { systemName, systemVersion, applicationName, applicationVersion, buildNumber, userAgent } = RTNUserAgent.getConstants();

export default {
    getUserAgent: () => {
        return userAgent;
    },
    getWebViewUserAgent: RTNUserAgent.getWebViewUserAgent,
    systemName,
    systemVersion,
    applicationName,
    applicationVersion,
    buildNumber,
};