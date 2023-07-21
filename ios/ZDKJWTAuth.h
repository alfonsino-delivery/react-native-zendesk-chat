#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <ChatProvidersSDK/ChatProvidersSDK.h>

@interface ZDKJWTAuth: NSObject<ZDKJWTAuthenticator>

{
    NSString *getUrl;
    NSString *token;
}

- (void)setUrl:(NSString *_Nullable)urlString withToken:(NSString *_Nullable)accessToken;
- (void)getToken:(void (^ _Nonnull)(NSString * _Nullable, NSError * _Nullable))completion;

@end
