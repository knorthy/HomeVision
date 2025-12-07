import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ROOM_IMAGE =
  "https://m.media-amazon.com/images/I/919Jj69lpqL._AC_SX679_.jpg";

const PRODUCTS = [
  {
    id: 1,
    name: "Carrier 1.0HP Inverter Window AC",
    price: 25662,
    position: { top: "18%", left: "8%" },
  },
  {
    id: 2,
    name: "Condura 6.3cu ft Inverter Two Door",
    price: 16578,
    position: { top: "30%", right: "10%" },
  },
  {
    id: 3,
    name: "#04 Honor 400 5G 512GB/ 12GB",
    price: 22999,
    position: { bottom: "22%", left: "15%" },
  },
  {
    id: 4,
    name: "Apple iPad A16 11th Gen WiFi",
    price: 28490,
    position: { bottom: "20%", right: "12%" },
  },
];

const MONTH_OPTIONS = [6, 9, 12, 18, 24];

// Total of ALL items (pre-calculated for performance & clarity)
const ALL_ITEMS_TOTAL = PRODUCTS.reduce((sum, p) => sum + p.price, 0);

export default function InstallationScreen() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [downPayment, setDownPayment] = useState(4462);
  const [selectedMonths, setSelectedMonths] = useState(12);

  const totalPrice = selectedItems.reduce((sum, id) => {
    const item = PRODUCTS.find((p) => p.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(PRODUCTS.map(p => p.id));
  };

  const calculateMonthly = (price) => {
    const remaining = price - downPayment;
    const monthly = selectedMonths === 0 ? 0 : remaining / selectedMonths;
    return monthly > 0 ? Math.round(monthly) : 0;
  };

  const allItemsMonthly = calculateMonthly(ALL_ITEMS_TOTAL);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>HOME CREDIT</Text>
        <Text style={styles.title}>Installment Simulator</Text>
      </View>

      {/* Room Image with Overlays */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: ROOM_IMAGE }} style={styles.roomImage} resizeMode="cover" />
        {PRODUCTS.map((product) => {
          const isSelected = selectedItems.includes(product.id);
          return (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.overlayButton,
                product.position,
                isSelected && styles.overlayButtonActive,
              ]}
              onPress={() => {
                toggleItem(product.id);
                setModalVisible(true);
              }}
            >
              <View style={styles.overlayContent}>
                <Ionicons
                  name={isSelected ? "checkmark-circle" : "add-circle-outline"}
                  size={32}
                  color="#fff"
                />
                <Text style={styles.overlayPrice}>₱{product.price.toLocaleString()}</Text>
                <Text style={styles.overlayName} numberOfLines={2}>
                  {product.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Bar */}
      {selectedItems.length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.bottomBarText}>
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected • Total ₱
            {totalPrice.toLocaleString()}
          </Text>
          <TouchableOpacity style={styles.viewButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.viewButtonText}>View Installments</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose your installment plan</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* NEW: All Items Package Card */}
              <View style={styles.allItemsCard}>
                <Text style={styles.allItemsTitle}>Get Your Complete Dream Room</Text>
                <Text style={styles.allItemsSubtitle}>All 4 items • Best value</Text>
                <Text style={styles.allItemsPrice}>₱{ALL_ITEMS_TOTAL.toLocaleString()}</Text>
                <Text style={styles.allItemsMonthly}>
                  Only ₱{allItemsMonthly.toLocaleString()}/mo for {selectedMonths} months
                </Text>
                <TouchableOpacity style={styles.selectAllBtn} onPress={selectAll}>
                  <Text style={styles.selectAllText}>Select All Items</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Selected Items List */}
              {selectedItems.length === 0 ? (
                <Text style={{ textAlign: "center", color: "#999", marginTop: 20 }}>
                  Tap items on the room to add them
                </Text>
              ) : (
                PRODUCTS.filter((p) => selectedItems.includes(p.id)).map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View>
                      <Text style={styles.itemPrice}>₱{item.price.toLocaleString()}</Text>
                      <Text style={styles.itemMonthly}>
                        ≈ ₱{calculateMonthly(item.price)}/mo
                      </Text>
                    </View>
                  </View>
                ))
              )}

              {/* Combined Total (only if >1 item) */}
              {selectedItems.length > 1 && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Combined Total</Text>
                    <Text style={styles.totalAmount}>₱{totalPrice.toLocaleString()}</Text>
                  </View>

                  <View style={styles.downPaymentSection}>
                    <Text style={styles.sectionTitle}>Preferred down payment</Text>
                    <View style={styles.downPaymentControl}>
                      <TouchableOpacity
                        onPress={() => setDownPayment(Math.max(0, downPayment - 500))}
                      >
                        <Ionicons name="remove-circle-outline" size={36} color="#E31E24" />
                      </TouchableOpacity>
                      <Text style={styles.downPaymentAmount}>₱{downPayment.toLocaleString()}</Text>
                      <TouchableOpacity onPress={() => setDownPayment(downPayment + 500)}>
                        <Ionicons name="add-circle-outline" size={36} color="#E31E24" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.monthlyTotal}>
                    <Text style={styles.monthlyLabel}>
                      Monthly for {selectedMonths} months
                    </Text>
                    <Text style={styles.monthlyAmount}>
                      ₱{calculateMonthly(totalPrice).toLocaleString()}/mo
                    </Text>
                  </View>
                </>
              )}

              {/* Term Selector */}
              <View style={styles.termSection}>
                <Text style={styles.sectionTitle}>Select monthly installment plan</Text>
                <View style={styles.termButtons}>
                  {MONTH_OPTIONS.map((months) => (
                    <TouchableOpacity
                      key={months}
                      style={[
                        styles.termButton,
                        selectedMonths === months && styles.termButtonActive,
                      ]}
                      onPress={() => setSelectedMonths(months)}
                    >
                      <Text
                        style={[
                          styles.termText,
                          selectedMonths === months && styles.termTextActive,
                        ]}
                      >
                        {months}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply with Home Credit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Add these new styles
const styles = StyleSheet.create({
  // ... (keep all your existing styles)

  allItemsCard: {
    backgroundColor: "#FFE5E5",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E31E24",
  },
  allItemsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E31E24",
  },
  allItemsSubtitle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  allItemsPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E31E24",
    marginVertical: 8,
  },
  allItemsMonthly: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E31E24",
    marginBottom: 12,
  },
  selectAllBtn: {
    backgroundColor: "#E31E24",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  selectAllText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Keep all your other existing styles below...
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#E31E24",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  title: { color: "#fff", fontSize: 14, fontWeight: "600" },
  imageContainer: { position: "relative", margin: 20 },
  roomImage: { width: "100%", height: 500, borderRadius: 16 },
  overlayButton: {
    position: "absolute",
    backgroundColor: "rgba(227, 30, 36, 0.9)",
    padding: 12,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    minWidth: 100,
  },
  overlayButtonActive: { backgroundColor: "#E31E24", transform: [{ scale: 1.1 }] },
  overlayContent: { alignItems: "center" },
  overlayPrice: { color: "#fff", fontWeight: "bold", fontSize: 16, marginVertical: 4 },
  overlayName: { color: "#fff", fontSize: 10, textAlign: "center" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E31E24",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  bottomBarText: { color: "#fff", fontWeight: "bold" },
  viewButton: { backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  viewButtonText: { color: "#E31E24", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
  itemName: { flex: 1, fontSize: 14 },
  itemPrice: { fontWeight: "bold", color: "#E31E24" },
  itemMonthly: { fontSize: 12, color: "#666" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  totalSection: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  totalLabel: { fontSize: 16 },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "#E31E24" },
  downPaymentSection: { marginVertical: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 12, fontSize: 16 },
  downPaymentControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
  },
  downPaymentAmount: { fontSize: 24, fontWeight: "bold" },
  monthlyTotal: {
    backgroundColor: "#fff0f0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  monthlyLabel: { fontSize: 16, color: "#666" },
  monthlyAmount: { fontSize: 28, fontWeight: "bold", color: "#E31E24", marginTop: 8 },
  termSection: { marginVertical: 20 },
  termButtons: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  termButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  termButtonActive: { backgroundColor: "#E31E24", borderColor: "#E31E24" },
  termText: { fontWeight: "bold" },
  termTextActive: { color: "#fff" },
  applyButton: {
    backgroundColor: "#E31E24",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
