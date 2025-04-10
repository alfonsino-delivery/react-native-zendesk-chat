declare module "react-native-zendesk-chat" {
	interface VisitorInfoOptions {
		name?: string;
		email?: string;
		phone?: string;
	}

	interface MessagingOptionsCommon {
		/** Set this to set the bot's displayName */
		botName?: string;
	}

	interface MessagingOptions_iOS extends MessagingOptionsCommon {
		/** Will be loaded using [UIImage imageWithName:…] ) */
		botAvatarName?: string;
		/** Will be loaded using [UIImage imageWithData:[NSData dataWithContentsOfUrl:…]] */
		botAvatarUrl?: string;
	}

	interface MessagingOptions_Android extends MessagingOptionsCommon {
		/** Will be loaded from your native asset resources */
		botAvatarDrawableId?: number;
	}

	/** Current default is "optional" */
	type PreChatFormFieldOptionVisibility = "hidden" | "optional" | "required";

	interface StartChatOptions extends VisitorInfoOptions {
		department?: string;
		tags?: string[];

		behaviorFlags?: {
			/** if omitted, the form is enabled */
			showPreChatForm?: boolean;
			/** if omitted, the prompt is enabled */
			showChatTranscriptPrompt?: boolean;
			/** if omitted, the form is enabled */
			showOfflineForm?: boolean;
			/** if omitted, the agent availability message is enabled */
			showAgentAvailability?: boolean;
		};

		/** If omitted, the preChatForm will be left as default in Zendesk */
		preChatFormOptions?: {
			/** Should we ask the user for a contact email? */
			email?: PreChatFormFieldOptionVisibility;
			/** Should we ask the user their name? */
			name?: PreChatFormFieldOptionVisibility;
			/** Should we ask the user for their phone number? */
			phone?: PreChatFormFieldOptionVisibility;
			/** Should we ask the user which department? */
			department?: PreChatFormFieldOptionVisibility;
		};

		/**
		 * Configure the Chat-Bot (if any)
		 */
		messagingOptions?: MessagingOptions_iOS & MessagingOptions_Android;

		/**
		 * If not provided, this will be "Close" -- not localized!
		 *
		 * -- iOS Only (Android: shows just a Back Button)
		 */
		localizedDismissButtonTitle?: string;
	}

	class RNZendeskChatModuleImpl {
		/**
		 * Must be called before calling startChat/setVisitorInfo
		 * - (Advanced users may configure this natively instead of calling this from JS)
		 */
		init: (zendeskAccountKey: string, appId: string, accessToken: string) => void;

		/**
		 * Presents the Zendesk Chat User Interface
		 */
		startChat: (options: StartChatOptions) => void;
		/**
		 * Backwards Compatibility!
		 * - You can pass all these parameters to RNZendeskChatModule.startChat
		 * - So you should probably prefer that method
		 */
		setVisitorInfo: (options: VisitorInfoOptions) => void;

		/**
		 * Configure the token to start receiving Push Notifications
		 */
		registerPushToken: (token: string) => void;
	}

	const RNZendeskChatModule: RNZendeskChatModuleImpl;

	export default RNZendeskChatModule;
}
