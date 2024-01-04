import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
	const toast = useToast();

	const showToast = (status, title, description) => {
		toast({
			title,
			description,
			status,
			duration: 3000,
			isClosable: true,
			position: "top"
		});
	};

	return showToast;
};

export default useCustomToast;
