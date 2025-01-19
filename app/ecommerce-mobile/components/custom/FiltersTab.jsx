import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react-native";
import FilterSheetSelect from "../filters/FilterSheetSelect"; // Ensure the path is correct

const FiltersTab = () => {
  const [filters, setFilters] = useState({
    brand: null, // Single selection, so use null instead of an array
    model: null,
    price: null,
    size: null,
  });

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null); // Track which filter is active
  const [filterOptions, setFilterOptions] = useState([]); // Options for the active filter

  // Define filter options for each filter
  const filterData = {
    brand: ["Brand A", "Brand B", "Brand C"],
    model: ["Model X", "Model Y", "Model Z"],
    price: ["Low to High", "High to Low"],
    size: ["S", "M", "L", "XL"],
  };

  // Open the sheet and set the current filter and its options
  const openSheet = (filterName) => {
    setCurrentFilter(filterName);
    setFilterOptions(filterData[filterName]);
    setIsSheetVisible(true);
  };

  // Handle applying selected options
  const handleApply = (selectedOption) => {
    setFilters({ ...filters, [currentFilter]: selectedOption });
    setIsSheetVisible(false); // Close the sheet after applying
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({ brand: null, model: null, price: null, size: null });
  };

  return (
    <View className="flex-1">
      {/* Horizontal ScrollView for Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="">
        <FilterTab title={"Brand"} value={filters.brand} onPress={() => openSheet("brand")} />
        <FilterTab title={"Model"} value={filters.model} onPress={() => openSheet("model")} />
        <FilterTab title={"Price"} value={filters.price} onPress={() => openSheet("price")} />
        <FilterTab title={"Size"} value={filters.size} onPress={() => openSheet("size")} />
        <FilterTab title={"Clear"}   />
      </ScrollView>

     

      {/* Modal for Filter Options */}
      <Modal visible={isSheetVisible} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1} // Prevents the background from flashing when clicked
          onPress={() => setIsSheetVisible(false)} // Close modal when clicking outside
        >
          <View className="flex-1 justify-end bg-black/50">
            {/* Sheet Content */}
            <View className="bg-white w-full h-1/2 rounded-t-lg p-4">
              <Text className="text-lg font-bold mb-4">Select {currentFilter}</Text>
              <FilterSheetSelect
                options={filterOptions}
                onApply={handleApply}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default FiltersTab;

// FilterTab Component
function FilterTab({ title, value, onPress }) {
  return (
    <>
    {
      title === "Clear" ?  <TouchableOpacity
        className="px-4 py-[2px] flex-row justify-between items-center  bg-[#2B2B2B]  border-[1px] border-[#DADADA] rounded-lg"
      onPress={onPress}
    >
      <Text className="text-lg font-medium text-white">{title}</Text>
    </TouchableOpacity>    :   <TouchableOpacity
      className="px-4 py-[2px] flex-row justify-between items-center border-[1px] border-[#DADADA] rounded-lg mr-1 "
      onPress={onPress}
    >
      <Text className="text-lg font-medium">{value || title}</Text>
      <ChevronDown size={16} color="#6b7280" />
    </TouchableOpacity>
    }
    
    
    
    </>
  );
}

