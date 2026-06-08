import Header from "@/components/ui/blocks/header2";
import Button from "@/components/ui/button";
import PostCard from "@/components/ui/cards/post-card";
import { colors } from "@/constants/color";
import * as size from "@/constants/size";
import { styles } from "@/constants/styles";
import { User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

const USERNAME = "mozarist";

export default function ProfileScreen() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://171.16.1.164:8000/api/posts");
      const json: ApiResponse = await response.json();
      const all = Array.isArray(json.data) ? json.data : [];
      const mine = all.filter((p) => p.authentication === USERNAME);
      setPosts(mine);
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
      <Header title="Search" />

      

      {isLoading && posts.length === 0 ? (
        <View style={localStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <PostCard
              name={item.authentication}
              coverUri={item.content}
              caption={item.caption ?? "Post caption"}
              status={item.tagline}
              tags={item.hashtags ?? []}
              likes={item.likes ?? 0}
              reposts={item.reposts ?? 0}
              comments={0}
              location={item.location ?? "Location"}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={getPosts}
          refreshing={isLoading}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={localStyles.empty}>Belum ada postingan</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  headerContainer: {
    padding: size.spacing.lg,
    gap: size.spacing.md,
  },
  avatarRow: {
    flexDirection: "row",
    gap: size.spacing.md,
    alignItems: "center",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 72,
    backgroundColor: colors.muted + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: size.fontSize.lg,
    color: colors.foreground,
    fontWeight: "700",
  },
  email: {
    fontSize: size.fontSize.sm,
    color: colors.muted,
  },
  bio: {
    color: colors.text,
    fontSize: size.fontSize.md,
  },
  statsRow: {
    flexDirection: "row",
    gap: size.spacing.xl,
    marginTop: size.spacing.sm,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: size.fontSize.lg,
    fontWeight: "700",
    color: colors.foreground,
  },
  statLabel: {
    fontSize: size.fontSize.xs,
    color: colors.muted,
  },
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
