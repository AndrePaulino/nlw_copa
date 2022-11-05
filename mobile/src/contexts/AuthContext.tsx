import React, { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
	name: string;
	avatarUrl: string;
}

interface AuthContextProviderProps {
	children: ReactNode;
}

export interface AuthContextDataProps {
	user: UserProps;
	isUserLoading: boolean;
	signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [user, setUser] = useState<UserProps>({} as UserProps);
	const [isUserLoading, setIsUserLoading] = useState(false);

	const [request, googleResponse, promptAsync] = Google.useAuthRequest({
		clientId:
			"495403270272-25ibag4435n9dtj9dpuoveom24la4a0t.apps.googleusercontent.com",
		redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
		scopes: ["profile", "email"],
	});

	async function signIn() {
		try {
			setIsUserLoading(true);
			await promptAsync();
		} catch (err) {
			console.log(err);
			throw err;
		} finally {
			setIsUserLoading(false);
		}
	}

	async function signInWithGoogle(access_token: string) {
		try {
			setIsUserLoading(true);
			const tokenResponse = await api.post("/users", { access_token });

			api.defaults.headers.common[
				"Authorization"
			] = `Bearer ${tokenResponse.data.token}`;

			const userInfoResponse = await api.get("/me");
			setUser(userInfoResponse.data.user);
		} catch (err) {
			console.log(err);
			throw err;
		} finally {
			setIsUserLoading(false);
		}
	}

	useEffect(() => {
		if (
			googleResponse?.type == "success" &&
			googleResponse.authentication?.accessToken
		) {
			signInWithGoogle(googleResponse.authentication.accessToken);
		}
	}, [googleResponse]);

	return (
		<AuthContext.Provider
			value={{
				user,
				isUserLoading,
				signIn,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
