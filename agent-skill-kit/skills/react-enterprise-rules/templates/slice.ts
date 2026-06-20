import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TRequestStatus = "idle" | "loading" | "success" | "error";

interface IEntityState {
  status: TRequestStatus;
  errorMessage: string | null;
  selectedId: string | null;
}

const initialState: IEntityState = {
  status: "idle",
  errorMessage: null,
  selectedId: null,
};

export const entitySlice = createSlice({
  name: "entity",
  initialState,
  reducers: {
    selectEntity: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedId = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.errorMessage = action.payload;
    },
  },
});

export const { selectEntity, clearSelection, setError } = entitySlice.actions;
export const entityReducer = entitySlice.reducer;
