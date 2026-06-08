import Header from "@/components/ui/blocks/header";
import PostCard from "@/components/ui/cards/post-card";
import { colors } from "@/constants/color";
import * as size from "@/constants/size";
import { styles } from "@/constants/styles";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
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

export default function HomeScreen() {
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
      {isLoading && posts.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.background,
          }}
        >
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
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: size.spacing.xl,
              }}
            >
              <LottieView
                source={require("@/assets/animations/not-found.json")}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />

              <Text
                style={{
                  color: colors.muted,
                  fontSize: size.fontSize.md,
                  textAlign: "center",
                }}
              >
                Belum ada postingan. Jadilah yang pertama untuk bersuara!
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        />
      )}
    </SafeAreaView>
  );
}
