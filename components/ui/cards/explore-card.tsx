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

type ExploreCardProps = {
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

export default function ExploreCard({
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
    onPress = () => { },
}: ExploreCardProps) {
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
                <View style={styles.contentBlock}>
                    <Text numberOfLines={2} style={styles.caption}>
                        {caption}
                    </Text>
                    <Text style={styles.tags}>
                        {tags.map((tag) => `#${tag}`).join("  ")}
                    </Text>
                </View>

                {coverUri && (<Image source={coverUri} style={styles.coverImage} contentFit="cover" />)}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: size.spacing.md,
    },
    name: {
        color: colors.primary,
        fontSize: size.fontSize.sm,
        fontWeight: 500,
        letterSpacing: -0.3,
    },
    statusBadge: {
        paddingHorizontal: size.spacing.md,
        paddingVertical: size.spacing.xs,
    },
    coverImage: {
        flex: 1,
        backgroundColor: colors.muted + "20",
        borderRadius: size.radius.md,
        height: 72,
        width: 72,
    },
    contentBlock: {
        flex: 6,
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
