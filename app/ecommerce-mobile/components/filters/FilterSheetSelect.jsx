import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";

const FilterSheetSelect = ({ options, onApply }) => {
  const [selectedOption, setSelectedOption] = useState(null); // Track the single selected option

  // Handle selection of an option
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <View className="flex-1">
      {/* Options List */}
      <FlatList
        data={options}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center p-3 border-b border-gray-200"
            onPress={() => handleSelectOption(item)}
          >
            {/* Radio Button */}
            <View className="w-5 h-5 border border-gray-400 rounded-full mr-3 justify-center items-center">
              {selectedOption === item && (
                <View className="w-3 h-3 bg-[#FF8765] rounded-full" />
              )}
            </View>
            <Text className="text-lg">{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Apply Button */}
      <TouchableOpacity
            className="bg-[#2B2B2B] px-4 py-2 rounded-lg mt-4 items-center"
        onPress={() => onApply(selectedOption)}
      >
        <Text className="text-white  text-lg">Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterSheetSelect;