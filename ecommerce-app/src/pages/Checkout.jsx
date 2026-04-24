import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import CartView from "../components/Cart/CartView";
import AddressList from "../components/Checkout/Address/AddressList";
import PaymentList from "../components/Checkout/Payment/PaymentList";
import SummarySection from "../components/Checkout/shared/SummarySection";
import Button from "../components/common/Button/Button";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import {
    getShippingAddresses,
    getDefaultShippingAddress,
    createShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
} from "../services/shippingService";

import {
    getPaymentMethods,
    getDefaultPaymentMethod,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
} from "../services/paymentService";

import { http } from "../services/http";
import * as styles from "./CheckoutStyles";

const AddressForm = lazy(() => import("../components/Checkout/Address/AddressForm"));
const PaymentForm = lazy(() => import("../components/Checkout/Payment/PaymentForm"));