import { VStack, Text, Icon } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";

export function Polls() {
	const { navigate } = useNavigation();

	return (
		<VStack flex={1} bgColor={"gray.900"}>
			<Header title={"Meus bolões"} />

			<VStack
				mt={6}
				mx={5}
				borderBottomWidth={1}
				borderBottomColor={"gray.600"}
				pb={4}
				mb={4}
			>
				<Button
					title={"BUSCAR BOLÃO POR CÓDIGO"}
					onPress={() => navigate("find")}
					leftIcon={
						<Icon
							as={FontAwesome5}
							name={"search"}
							color="black"
							size={"md"}
						/>
					}
				/>
			</VStack>
		</VStack>
	);
}
