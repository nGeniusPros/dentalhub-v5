export const edgeFunctionsService = {
  invoke: async (functionName: string, data: any) => {
    try {
      const response = await fetch(`/api/edge-functions/${functionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to invoke edge function: ${functionName}`,
        );
      }

      return await response.json();
    } catch (error: any) {
      console.error(`Error invoking edge function ${functionName}:`, error);
      throw error;
    }
  },
};
