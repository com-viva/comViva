
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import type { ComponentType } from 'react';
import type { MaskedViewProps } from '@react-native-masked-view/masked-view';
import { Colors } from '@/constants/Colors';

export interface SelectOption {
    label: string;
    value: number;
}

interface SelectProps {
    label: string;
    options: SelectOption[];
    value: number | null;
    onChange: (value: number | null) => void;
    disabled?: boolean;
}

export function Select({ label, options, value, onChange, disabled = false }: SelectProps) {

    const [visible, setVisible] = useState(false);
    const animatedValue = useRef(new Animated.Value(value !== null ? 1 : 0)).current;
    const isFloating = visible || value !== null;
    const selectedOption = options.find((item) => item.value === value);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isFloating ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isFloating, animatedValue]);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -30],
    });

    const scale = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.8],
    });

    const selecionar = (id: number) => {
        onChange(id);
        setVisible(false);
    };

    const TypedMaskedView = MaskedView as ComponentType<MaskedViewProps>;

    return (
        <>
            <Pressable
                style={styles.container}
                onPress={() => !disabled && setVisible(true)}
                disabled={disabled}
            >
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.labelContainer,
                        {
                            transform: [{ translateY }, { scale }],
                        },
                    ]}
                >
                    {visible ? (
                        <TypedMaskedView
                            maskElement={
                                <Text style={styles.label}>
                                    {label}
                                </Text>
                            }
                        >
                            <LinearGradient
                                colors={[Colors.primary.start, Colors.primary.end]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={[styles.label, { opacity: 0 }]}>
                                    {label}
                                </Text>
                            </LinearGradient>
                        </TypedMaskedView>
                    ) : (
                        <Text style={[styles.label, styles.inactiveLabel]}>
                            {label}
                        </Text>
                    )}
                </Animated.View >

                <View style={styles.input}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.value,
                            !selectedOption && styles.placeholder,
                        ]}
                    >
                        {selectedOption?.label ?? ''}
                    </Text>

                    <AntDesign
                        name={visible ? 'up' : 'down'}
                        size={14}
                        color={Colors.text.secondary}
                    />
                </View>

                {
                    isFloating ? (
                        <LinearGradient
                            colors={[Colors.primary.start, Colors.primary.end]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.activeLine}
                        />
                    ) : (
                        <View style={styles.inactiveLine} />
                    )
                }
            </Pressable >

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <Pressable
                        style={styles.modal}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>

                            <Pressable onPress={() => setVisible(false)}>
                                <AntDesign
                                    name="close"
                                    size={20}
                                    color={Colors.text.primary}
                                />
                            </Pressable>
                        </View>

                        {value !== null && (
                            <Pressable
                                style={styles.option}
                                onPress={() => {
                                    onChange(null);
                                    setVisible(false);
                                }}
                            >
                                <Text style={styles.clearText}>Limpar seleção</Text>
                            </Pressable>
                        )}

                        <FlatList
                            data={options}
                            keyExtractor={(item) => String(item.value)}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                <Text style={styles.empty}>
                                    Nenhuma opção disponível.
                                </Text>
                            }
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.option}
                                    onPress={() => selecionar(item.value)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item.value === value && styles.selectedText,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>

                                    {item.value === value && (
                                        <AntDesign
                                            name="check"
                                            size={16}
                                            color={Colors.primary.end}
                                        />
                                    )}
                                </Pressable>
                            )}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        justifyContent: 'flex-end',
    },

    labelContainer: {
        position: 'absolute',
        left: 0,
        marginBottom: 3,
        zIndex: 1,
    },

    label: {
        fontSize: 16,
        fontWeight: '400',
    },

    inactiveLabel: {
        color: Colors.text.secondary,
    },

    input: {
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: Colors.text.primary,
        marginRight: 8,
    },
    placeholder: {
        color: 'transparent',
    },
    inactiveLine: {
        height: 2,
        backgroundColor: Colors.border,
    },
    activeLine: {
        height: 2,
        borderRadius: 2,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        padding: 24,
    },
    modal: {
        maxHeight: '70%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.text.primary,
    },
    option: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.border,
    },
    optionText: {
        fontSize: 15,
        color: Colors.text.primary,
    },
    selectedText: {
        color: Colors.primary.end,
        fontWeight: '600',
    },
    clearText: {
        fontSize: 14,
        color: Colors.primary.end,
    },
    empty: {
        textAlign: 'center',
        padding: 20,
        color: Colors.text.secondary,
    },
});
