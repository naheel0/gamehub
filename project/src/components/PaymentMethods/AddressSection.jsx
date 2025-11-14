import React, { useState, useMemo, useEffect } from "react";
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const AddressSection = ({
  selectedAddress,
  setSelectedAddress,
}) => {
  const { user, updateUserPartial } = useAuth();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "india",
    phone: "",
    isDefault: false,
  });

  const userAddresses = useMemo(() => user?.addresses || [], [user]);

  useEffect(() => {
    if (userAddresses.length > 0 && !selectedAddress) {
      const defaultAddress =
        userAddresses.find((addr) => addr.isDefault) || userAddresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [userAddresses, selectedAddress, setSelectedAddress]);

  const handleAddressInputChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "india",
      phone: "",
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const validateAddress = () => {
    const required = [
      "fullName",
      "addressLine1",
      "city",
      "state",
      "zipCode",
      "country",
    ];
    for (const field of required) {
      if (!addressForm[field].trim()) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }

    if (!/^[1-9][0-9]{5}$/.test(addressForm.zipCode)) {
      toast.error("Please enter a valid ZIP code");
      return false;
    }

    if (addressForm.phone && !/^[6-9]\d{9}$/.test(addressForm.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateAddress()) return;

    try {
      const newAddress = {
        id: editingAddress || `addr_${Date.now()}`,
        ...addressForm,
        zipCode: addressForm.zipCode.replace(/\D/g, ""),
        phone: addressForm.phone.replace(/\D/g, ""),
      };

      let updatedAddresses;

      if (editingAddress) {
        updatedAddresses = userAddresses.map((addr) =>
          addr.id === editingAddress ? newAddress : addr
        );
      } else {
        updatedAddresses = [...userAddresses];

        if (addressForm.isDefault) {
          updatedAddresses = updatedAddresses.map((addr) => ({
            ...addr,
            isDefault: false,
          }));
        }

        updatedAddresses.push(newAddress);
      }

      await updateUserPartial({ addresses: updatedAddresses });

      toast.success(
        `Address ${editingAddress ? "updated" : "saved"} successfully!`
      );
      setShowAddressForm(false);
      resetAddressForm();
      setSelectedAddress(newAddress.id);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      fullName: address.fullName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || "",
      isDefault: address.isDefault || false,
    });
    setEditingAddress(address.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (userAddresses.length <= 1) {
      toast.error("You must have at least one address");
      return;
    }

    try {
      const updatedAddresses = userAddresses.filter(
        (addr) => addr.id !== addressId
      );

      await updateUserPartial({ addresses: updatedAddresses });

      if (selectedAddress === addressId) {
        setSelectedAddress(updatedAddresses[0]?.id || null);
      }

      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address. Please try again.");
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const updatedAddresses = userAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      await updateUserPartial({ addresses: updatedAddresses });
      toast.success("Default address updated!");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to update default address.");
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FaMapMarkerAlt className="text-red-500 mr-3" />
          Shipping Address
        </h2>
        <button
          onClick={() => {
            resetAddressForm();
            setShowAddressForm(true);
          }}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          <FaPlus className="h-4 w-4" />
          <span>Add New</span>
        </button>
      </div>

      {showAddressForm ? (
        <div className="space-y-4">
          {/* Address form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={addressForm.fullName}
                onChange={(e) =>
                  handleAddressInputChange("fullName", e.target.value)
                }
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            {/* Address line 1 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={addressForm.addressLine1}
                onChange={(e) =>
                  handleAddressInputChange("addressLine1", e.target.value)
                }
                placeholder="Street address, P.O. box, etc."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            {/* Address line 2 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={addressForm.addressLine2}
                onChange={(e) =>
                  handleAddressInputChange("addressLine2", e.target.value)
                }
                placeholder="Apartment, suite, building, etc."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City *
              </label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) =>
                  handleAddressInputChange("city", e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State *
              </label>
              <input
                type="text"
                value={addressForm.state}
                onChange={(e) =>
                  handleAddressInputChange("state", e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            {/* ZIP */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                value={addressForm.zipCode}
                onChange={(e) =>
                  handleAddressInputChange("zipCode", e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) =>
                  handleAddressInputChange("phone", e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) =>
                  handleAddressInputChange("isDefault", e.target.checked)
                }
                className="h-4 w-4 text-red-600 bg-gray-800 border-gray-600 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-300">
                Set as default
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  resetAddressForm();
                }}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {editingAddress ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {userAddresses.length === 0 ? (
            <div className="text-center py-8">
              <FaMapMarkerAlt className="text-gray-500 text-4xl mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No addresses saved yet</p>
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            userAddresses.map((address) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddress(address.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                  selectedAddress === address.id
                    ? "border-red-500 bg-red-500/10"
                    : "border-gray-600 hover:border-red-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-white">
                        {address.fullName}
                      </span>
                      {address.isDefault && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    {address.phone && (
                      <p className="text-gray-400 text-sm mt-1">
                        Phone: {address.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    {userAddresses.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {!address.isDefault && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefaultAddress(address.id);
                      }}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Set as default
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSection;
