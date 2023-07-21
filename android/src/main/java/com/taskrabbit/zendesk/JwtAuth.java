package com.taskrabbit.zendesk;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import zendesk.chat.JwtAuthenticator;

class JwtAuth implements JwtAuthenticator {
    private String getUrl;
    private String token;

    OkHttpClient client = new OkHttpClient();
    final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    JwtAuth(String getUrl, String token) {
        this.getUrl = getUrl;
        this.token = token;
    }

    private void retrieveToken(final JwtCallback callback) throws IOException {

        RequestBody body = RequestBody.create(JSON, "{}");


        Request.Builder requestBuilder = new Request.Builder()
                .url(getUrl)
                .post(body);

        if (token != null && token.length() > 1) {
            // Add the token as Authorization Bearer in the header
            requestBuilder.addHeader("Authorization", "Bearer " + token);
        }

        Request request = requestBuilder.build();
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                e.printStackTrace();
                callback.onError();
            }

            @Override
            public void onResponse( Call call,  Response response) throws IOException {
                String jsonData = response.body().string();
                try {
                    JSONObject Jobject = new JSONObject(jsonData);
                    String zendesk_jwt = (String) Jobject.get("jwt");

                    callback.onSuccess(zendesk_jwt);

                } catch (JSONException e) {
                    e.printStackTrace();
                    callback.onError();
                }
            }
        });
    }

    @Override
    public void getToken(final JwtCompletion jwtCompletion) {
        try {
            retrieveToken(new JwtCallback() {
                @Override
                public void onSuccess(String token) {
                    jwtCompletion.onTokenLoaded(token);
                }

                @Override
                public void onError() {
                    jwtCompletion.onError();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    interface JwtCallback {
        void onSuccess(String token);

        void onError();
    }
}