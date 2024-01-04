import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
	// define the part you're going to style
	overlay: {
		bg: "whiteAlpha.200" //change the background
	},
	dialog: {
		borderRadius: "3xl",
		bg: `black`
	}
});

export const modalTheme = defineMultiStyleConfig({
	baseStyle
});
