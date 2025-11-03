import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RegistroLotes() {
    const [lotes, setLotes] = useState<any[]>([]);
    const [form, setForm] = useState({
        propriedade: "",
        nome: "",
        area: "",
    });

    interface Cultivo {
        tipo: string;
        inicio: string;
        colheita: string;
        areaPlantada: string;
        observacoes: string;
    }

    interface Lote {
        propriedade: string;
        nome: string;
        area: string;
        cultivos: Cultivo[];
    }


    const [novoCultivo, setNovoCultivo] = useState({
        tipo: "",
        inicio: "",
        colheita: "",
        areaPlantada: "",
        observacoes: "",
    });

    const [loteSelecionado, setLoteSelecionado] = useState<number | null>(null);

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleAddLote = () => {
        if (!form.propriedade || !form.nome || !form.area) {
            alert("Preencha todos os campos do lote!");
            return;
        }

        const novoLote = { ...form, cultivos: [] };
        setLotes([...lotes, novoLote]);
        setForm({ propriedade: "", nome: "", area: "" });
    };

    const handleAddCultivo = (index: number) => {
        if (
            !novoCultivo.tipo ||
            !novoCultivo.inicio ||
            !novoCultivo.colheita ||
            !novoCultivo.areaPlantada
        ) {
            alert("Preencha todos os campos do cultivo!");
            return;
        }

        const copia = [...lotes];
        copia[index].cultivos.push(novoCultivo);
        setLotes(copia);
        setNovoCultivo({
            tipo: "",
            inicio: "",
            colheita: "",
            areaPlantada: "",
            observacoes: "",
        });
        setLoteSelecionado(null);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Registrar Lotes</Text>

            {/* Formulário de novo lote */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome da Propriedade"
                    value={form.propriedade}
                    onChangeText={(v) => handleChange("propriedade", v)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nome do Lote (Ex: Lote A1)"
                    value={form.nome}
                    onChangeText={(v) => handleChange("nome", v)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Área Total (ha)"
                    keyboardType="numeric"
                    value={form.area}
                    onChangeText={(v) => handleChange("area", v)}
                />

                <TouchableOpacity style={styles.addButton} onPress={handleAddLote}>
                    <Text style={styles.addButtonText}>Cadastrar Lote</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de lotes */}
            {lotes.map((lote, index) => (
                <View key={index} style={styles.card}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="leaf-outline" size={24} color="#32CD32" />
                        <View style={{ marginLeft: 8 }}>
                            <Text style={styles.cardTitle}>{lote.nome}</Text>
                            <Text style={styles.cardSubtitle}>
                                {lote.propriedade} • {lote.area} ha
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <TouchableOpacity
                            style={styles.cardButton}
                            onPress={() =>
                                setLoteSelecionado(loteSelecionado === index ? null : index)
                            }
                        >
                            <Ionicons
                                name={
                                    loteSelecionado === index
                                        ? "close-circle-outline"
                                        : "add-circle-outline"
                                }
                                size={18}
                                color="#333"
                            />
                            <Text style={styles.cardButtonText}>Cultivo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Formulário de cultivo dentro do card */}
                    {loteSelecionado === index && (
                        <View style={styles.cultivoForm}>
                            <Text style={styles.sectionTitle}>Adicionar Cultivo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tipo de Plantio (Ex: Soja, Milho...)"
                                value={novoCultivo.tipo}
                                onChangeText={(v) =>
                                    setNovoCultivo({ ...novoCultivo, tipo: v })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Data de Início (DD/MM/AAAA)"
                                value={novoCultivo.inicio}
                                onChangeText={(v) =>
                                    setNovoCultivo({ ...novoCultivo, inicio: v })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Data Estimada de Colheita (DD/MM/AAAA)"
                                value={novoCultivo.colheita}
                                onChangeText={(v) =>
                                    setNovoCultivo({ ...novoCultivo, colheita: v })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Área Plantada (ha)"
                                keyboardType="numeric"
                                value={novoCultivo.areaPlantada}
                                onChangeText={(v) =>
                                    setNovoCultivo({ ...novoCultivo, areaPlantada: v })
                                }
                            />
                            <TextInput
                                style={[styles.input, { height: 80 }]}
                                placeholder="Observações"
                                multiline
                                value={novoCultivo.observacoes}
                                onChangeText={(v) =>
                                    setNovoCultivo({ ...novoCultivo, observacoes: v })
                                }
                            />

                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => handleAddCultivo(index)}
                            >
                                <Text style={styles.addButtonText}>Salvar Cultivo</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Lista de cultivos */}
                    {lote.cultivos.map((c: {
                        tipo: string;
                        inicio: string;
                        colheita: string;
                        areaPlantada: string;
                        observacoes: string;
                    }, i: number) => (
                        <View key={i} style={styles.cultivoCard}>
                            <Text style={styles.cultivoTitle}>{c.tipo}</Text>
                            <Text style={styles.cultivoSub}>
                                Início: {c.inicio} | Colheita: {c.colheita}
                            </Text>
                            <Text style={styles.cultivoSub}>Área: {c.areaPlantada} ha</Text>
                            {c.observacoes ? (
                                <Text style={styles.cultivoObs}>{c.observacoes}</Text>
                            ) : null}
                        </View>
                    ))}

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#32CD32",
        marginBottom: 16,
    },
    form: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#F9F9F9",
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        color: "#333",
    },
    addButton: {
        backgroundColor: "#32CD32",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
    cardSubtitle: { fontSize: 14, color: "#777" },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    cardButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        padding: 10,
        borderRadius: 6,
        flex: 1,
        justifyContent: "center",
    },
    cardButtonText: {
        fontSize: 14,
        color: "#333",
        marginLeft: 6,
    },
    cultivoForm: {
        backgroundColor: "#F9F9F9",
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#32CD32",
        marginBottom: 8,
    },
    cultivoCard: {
        backgroundColor: "#F9F9F9",
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
    },
    cultivoTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
    cultivoSub: { fontSize: 13, color: "#555" },
    cultivoObs: { fontSize: 13, color: "#777", marginTop: 4 },
});
