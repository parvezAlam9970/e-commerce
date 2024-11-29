import tw from "twrnc";

const twCustom = (className) => {
  const extendedStyles = {
    "font-medium": { fontFamily: "Poppins-Medium" },
    "font-bold": { fontFamily: "Poppins-Bold" },
  };

  return tw(className, extendedStyles);
};

export default twCustom;
