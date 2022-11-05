import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlusCircle, SoccerBall } from "phosphor-react-native";
import { useTheme } from "native-base";
import { New } from "../screens/New";
import { Polls } from "../screens/Polls";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
	const { colors, sizes } = useTheme();
	const size = sizes[6];

	return (
		<Navigator
			screenOptions={{
				headerShown: false,
				tabBarLabelPosition: "beside-icon",
				tabBarActiveTintColor: colors.yellow[500],
				tabBarInactiveTintColor: colors.gray[300],
				tabBarStyle: {
					position: "absolute",
					height: sizes[16],
					borderTopWidth: 0,
					backgroundColor: colors.gray[800],
				},
				tabBarItemStyle: {
					position: "relative",
				},
			}}
		>
			<Screen
				name="new"
				component={New}
				options={{
					tabBarLabel: "Novo bolão",
					tabBarIcon: ({ color }) => (
						<PlusCircle color={color} size={size} />
					),
				}}
			/>

			<Screen
				name="polls"
				component={Polls}
				options={{
					tabBarLabel: "Meus bolões",
					tabBarIcon: ({ color }) => (
						<SoccerBall color={color} size={size} />
					),
				}}
			/>
		</Navigator>
	);
}
