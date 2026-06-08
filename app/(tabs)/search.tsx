import Header from "@/components/ui/blocks/header2";
import Input from "@/components/ui/text-input";
import { colors } from "@/constants/color";
import * as size from "@/constants/size";
import { styles } from "@/constants/styles";
import {
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header title="Search" />

      <View style={styles.container}>
        <Input placeholder="Cari momen-momen siswa..." />
      </View>
    </SafeAreaView>
  );
}
