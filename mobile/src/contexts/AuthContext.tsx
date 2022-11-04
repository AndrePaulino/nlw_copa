import React, { createContext, ReactNode, useState, useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

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

	const [request, response, promptAsync] = Google.useAuthRequest({
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

	async function signInWithGoogle(accessToken: string) {
		console.log("ACCESS_TOKEN => ", accessToken);
	}

	useEffect(() => {
		if (response?.type == "success" && response.authentication?.accessToken)
			signInWithGoogle(response.authentication.accessToken);
	}, [response]);

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
