import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiService from "../app/services/apiServices.jsx";

export function useEntity(resource) {
	const queryClient = useQueryClient();

	const { data, error, isLoading } = useQuery({
		queryKey: [resource],
		queryFn: () => apiService.get(`/${resource}`),
	});

	const { mutate: addItem } = useMutation({
		mutationFn: (newData) => apiService.post(`/${resource}`, newData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [resource] });
		},
	});

	const { mutate: updateItem } = useMutation({
		mutationFn: ({ id, ...updatedData }) =>
			apiService.put(`/${resource}/${id}`, updatedData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [resource] });
		},
	});

	const { mutate: deleteItem } = useMutation({
		mutationFn: (id) => apiService.delete(`/${resource}/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [resource] });
		},
	});

	return {
		data,
		error,
		isLoading,
		addItem,
		updateItem,
		deleteItem,
	};
}
