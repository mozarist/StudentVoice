import { colors } from "@/constants/color";
import * as size from "@/constants/size";
import { Image } from "expo-image";
import {
  Heart,
  MapPin,
  MessageCircle,
  Repeat2,
  Send,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Badge from "../badge";
import Card from "../card";

type PostCardProps = {
  name?: string;
  location?: string | null;
  status?: string | null;
  avatarUri?: string | null;
  coverUri?: string | null;
  caption?: string | null;
  tags?: string[];
  likes?: number;
  comments?: number;
  reposts?: number;
  onPress?: () => void;
};

function getStatusBadgeColors(status?: string | null) {
  const mood = status?.trim().toLowerCase();

  const moodColors: Record<string, { background: string; label: string }> = {
    senang: { background: colors.happy + "20", label: colors.happy },
    sedih: { background: colors.sad + "24", label: colors.sad },
    marah: { background: colors.angry + "20", label: colors.angry },
    tenang: { background: colors.chill + "20", label: colors.chill },
    terkejut: { background: colors.surprised + "28", label: colors.surprised },
    takut: { background: colors.scared + "30", label: colors.scared },
  };

  if (!mood || !moodColors[mood]) {
    return { background: "transparent", label: "transparent" };
  }

  return moodColors[mood];
}

export default function PostCard({
  name = "anonymous user",
  location = "Unknown location",
  status,
  avatarUri = "",
  coverUri = "",
  caption = "Post caption",
  tags = [],
  likes = 0,
  comments = 0,
  reposts = 0,
  onPress = () => {},
}: PostCardProps) {
  const statusBadgeColor = getStatusBadgeColors(status);
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [repostCount, setRepostCount] = useState(reposts);
  const hasAvatar = !!avatarUri?.trim();

  function handleLikePress() {
    setLiked((previous) => {
      const next = !previous;
      setLikeCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
      return next;
    });
    onPress();
  }

  function handleRepostPress() {
    setReposted((previous) => {
      const next = !previous;
      setRepostCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
      return next;
    });
    onPress();
  }

  return (
    <Card onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.profileBlock}>
          {hasAvatar ? (
            <Image
              source={avatarUri}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <User size={18} color={colors.muted} />
            </View>
          )}

          <View>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={colors.muted} />
              <Text numberOfLines={1} style={styles.location}>
                {location}
              </Text>
            </View>
          </View>
        </View>

        <Badge
          color={statusBadgeColor.background}
          labelColor={statusBadgeColor.label}
          style={styles.statusBadge}
        >
          {status ?? ""}
        </Badge>
      </View>

      {coverUri && (<Image source={coverUri} style={styles.coverImage} contentFit="cover" />)}

      <View style={styles.contentBlock}>
        <Text style={styles.caption}>{caption}</Text>
        <Text style={styles.tags}>
          {tags.map((tag) => `#${tag}`).join("  ")}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.actionsRow}>
        <Action
          icon={Heart}
          value={likeCount}
          onPress={handleLikePress}
          iconColor={liked ? colors.accent2 : colors.muted}
          fillColor={liked ? colors.accent2 : "none"}
        />
        <Action icon={MessageCircle} value={comments} onPress={onPress} />
        <Action
          icon={Repeat2}
          onPress={handleRepostPress}
          iconColor={reposted ? colors.accent3 : colors.muted}
          label={reposted ? "Reposted" : ""}
          labelColor={colors.accent3}
        />
        <Action icon={Send} onPress={onPress} align="right" />
      </View>
    </Card>
  );
}

type ActionProps = {
  icon: React.ComponentType<{ size?: number; color?: string; fill?: string }>;
  value?: string | number;
  onPress: () => void;
  align?: "left" | "right";
  iconColor?: string;
  fillColor?: string;
  label?: string;
  labelColor?: string;
};

function Action({
  icon: Icon,
  value,
  onPress,
  align = "left",
  iconColor = colors.muted,
  fillColor = "none",
  label = "",
  labelColor = colors.muted,
}: ActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, align === "right" && styles.shareButton]}
      hitSlop={8}
    >
      <Icon size={20} color={iconColor} fill={fillColor} />
      {!!label && (
        <Text style={[styles.repostLabel, { color: labelColor }]}>{label}</Text>
      )}
      {value !== undefined && value !== null && (
        <Text style={styles.actionText}>{value}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: size.spacing.md,
  },
  profileBlock: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: size.spacing.sm,
  },
  avatar: {
    backgroundColor: colors.muted + "20",
    borderRadius: size.radius.full,
    height: size.avatarSize.md,
    aspectRatio: 1,
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted + "20",
    borderRadius: size.radius.full,
    height: size.avatarSize.md,
    aspectRatio: 1,
  },
  name: {
    color: colors.primary,
    fontSize: size.fontSize.sm,
    fontWeight: 500,
    letterSpacing: -0.3,
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: size.spacing.xxs,
  },
  location: {
    maxWidth: 170,
    color: colors.muted,
    fontSize: size.fontSize.xs,
    fontWeight: 400,
  },
  statusBadge: {
    paddingHorizontal: size.spacing.md,
    paddingVertical: size.spacing.xs,
  },
  coverImage: {
    backgroundColor: colors.muted + "20",
    borderRadius: size.radius.md,
    height: 250,
    width: "100%",
  },
  contentBlock: {
    gap: size.spacing.xxs,
  },
  caption: {
    color: colors.foreground,
    fontSize: size.fontSize.md,
    fontWeight: 500,
  },
  tags: {
    color: colors.text,
    fontSize: size.fontSize.sm,
    fontWeight: 500,
    letterSpacing: -0.3,
  },
  separator: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  actionsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  actionButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: size.spacing.sm,
    marginRight: size.spacing.lg,
  },
  actionText: {
    color: colors.muted,
    fontSize: size.fontSize.md,
    fontWeight: "600",
  },
  repostLabel: {
    fontSize: size.fontSize.xs,
    fontWeight: "600",
  },
  shareButton: {
    marginLeft: "auto",
    marginRight: 0,
  },
});
