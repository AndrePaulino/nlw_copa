import { Center, Text, Icon } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { Button } from "../components/Button";
import Logo from "../assets/logo.svg";

export function SignIn() {
	return (
		<Center flex={1} bgColor="gray.900" p={7}>
			<Logo width={212} height={40} />
			<Button
				type={"SECONDARY"}
				title={"Entrar com Google"}
				mt={12}
				leftIcon={
					<Icon
						as={FontAwesome5}
						name="google"
						color="white"
						size="sm"
					/>
				}
			/>

			<Text color={"gray.200"} textAlign={"center"} mt={4}>
				Não utilizamos nenhuma informação além{"\n"}do seu e-mail para
				criação de sua conta.
			</Text>
		</Center>
	);
}
