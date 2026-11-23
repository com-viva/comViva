import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'outline' | 'filled';
    disabled?: boolean;
    loading?: boolean;
}

export function Button({ title, onPress, variant = 'filled', disabled = false, loading = false }: ButtonProps) {
    const isDisabled = disabled || loading;
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={styles.container}
        >
            <LinearGradient
                colors={[Colors.primary.start, Colors.primary.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.gradient,
                    isOutline && styles.outlineGradient,
                    isDisabled && styles.disabled,
                ]}
            >
                {isOutline ? (
                    <View style={styles.outlineContent}>
                        {loading
                            ? (<ActivityIndicator color={Colors.primary.start} />)
                            : (<Text style={styles.outlineText}>{title}</Text>)
                        }
                    </View>
                )
                    : loading
                        ? (<ActivityIndicator color={Colors.text.light} />)
                        : (<Text style={styles.filledText}>{title}</Text>)}
                        
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        overflow: 'hidden',
    },

    gradient: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    outlineGradient: {
        paddingVertical: 1.5,
        paddingHorizontal: 1.5,
    },

    outlineContent: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
        paddingVertical: 12.5,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    filledText: {
        color: Colors.text.light,
        fontSize: 16,
        fontWeight: '600',
    },

    outlineText: {
        color: Colors.primary.end,
        fontSize: 16,
        fontWeight: '600',
    },

    disabled: {
        opacity: 0.5,
    },
});