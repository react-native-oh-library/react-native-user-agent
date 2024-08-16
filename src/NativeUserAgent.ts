import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';
export interface Spec extends TurboModule {
    getWebViewUserAgent: () => Promise<string>;
    readonly getConstants:() => {};
}

export default TurboModuleRegistry.get<Spec>('UserAgentNativeModule') as Spec | null;