import { type InitialState, useFormInitials } from "../hooks/useFormInitialState";

export const SetFormData = (initialState: InitialState) => {
    useFormInitials(initialState);
}