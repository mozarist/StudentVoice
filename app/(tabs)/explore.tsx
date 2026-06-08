import Header from "@/components/ui/blocks/header";
import ExploreCard from "@/components/ui/cards/explore-card";
import Input from "@/components/ui/text-input";
import { colors } from "@/constants/color";
import * as size from "@/constants/size";
import { styles } from "@/constants/styles";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type ApiPost = {
  id: number;
  authentication: string;
  content: string;
  caption: string | null;
  tagline:
  | "senang"
  | "sedih"
  | "marah"
  | "tenang"
  | "terkejut"
  | "takut"
  | null;
  hashtags: string[] | null;
  likes: number | null;
  reposts: number | null;
  location: string | null;
};

type ApiResponse = {
  data: ApiPost[];
};

export default function ExploreScreen() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://171.16.1.164:8000/api/posts");
      const json: ApiResponse = await response.json();
      console.log("API Response:", json);
      console.log("Data:", json.data);
      console.log("Is Array:", Array.isArray(json.data));
      setPosts(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Input placeholder="Jelajahi suara siswa..." />

        <Text style={{ fontSize: size.fontSize.xl, fontWeight: 500 }}>
          Postingan Trending
        </Text>

        {isLoading && posts.length === 0 ? (
          <View style={localStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <ExploreCard
                coverUri={item.content}
                caption={item.caption ?? "Post caption"}
                tags={item.hashtags ?? []}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: size.spacing.xs }}
            onRefresh={getPosts}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={localStyles.empty}>Belum ada postingan</Text>
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    color: colors.muted,
    textAlign: "center",
    marginTop: size.spacing.xl,
  },
});
