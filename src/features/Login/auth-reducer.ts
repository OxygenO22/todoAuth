import { Dispatch } from 'redux'
import {
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType,
  setIsInitialisedAC,
} from '../../app/app-reducer'
import { autthAPI } from '../../api/todolists-api'
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils'
import { LoginFormType } from './Login'
import { clearTodosDataAC } from '../TodolistsList/todolists-reducer'
 
const initialState = {
  isLoggedIn: false,
}
type InitialStateType = typeof initialState
 
export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return { ...state, isLoggedIn: action.value }
    default:
      return state
  }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({ type: 'login/SET-IS-LOGGED-IN', value }) as const
 
// thunks
export const loginTC = (data: LoginFormType) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  autthAPI.login(data)
  .then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
      dispatch(setAppStatusAC('succeeded'));
    } else (
      handleServerAppError(res.data, dispatch)
    )
  }).catch((error) => {
    handleServerNetworkError(error, dispatch)
  })
}

export const meTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  autthAPI.me()
  .then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
      dispatch(setAppStatusAC('succeeded'));
    } else (
      handleServerAppError(res.data, dispatch)
    )
  }).catch((error) => {
    handleServerNetworkError(error, dispatch)
  }).finally(() => {
    dispatch(setIsInitialisedAC(true));
  })
}

export const logOutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  autthAPI.logOut()
  .then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(false));
      dispatch(setAppStatusAC('succeeded'));
      dispatch(clearTodosDataAC());
    } else (
      handleServerAppError(res.data, dispatch)
    )
  }).catch((error) => {
    handleServerNetworkError(error, dispatch)
  }).finally(() => {
    dispatch(setIsInitialisedAC(true));
  })
}
 
// types
type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType