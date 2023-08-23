#import "ZDKJWTAuth.h"

@implementation ZDKJWTAuth

- (void)setUrl:(NSString *)urlString withToken:(NSString *)accessToken {
    getUrl = urlString;
    token = accessToken;
}

- (void)getToken:(void (^)(NSString * _Nullable, NSError * _Nullable))completion {
    NSURL *url = [NSURL URLWithString:getUrl];

    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];

    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    if (token.length) {
        [request setHTTPMethod:@"GET"];
        NSString *authorizationHeader = [NSString stringWithFormat:@"Bearer %@", token];
        [request addValue:authorizationHeader forHTTPHeaderField:@"Authorization"];
    } else {
        [request setHTTPMethod:@"POST"];
    }

    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            completion(nil, error);
            return;
        }

        NSError *jsonError;
        NSDictionary *jsonDict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:&jsonError];

        if (jsonError) {
            completion(nil, jsonError);
        } else {
            NSString *jwt = jsonDict[@"jwt"];
            completion(jwt, nil);
        }
    }];
    
    [dataTask resume];
}

@end

