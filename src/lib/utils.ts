export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getWhatsAppUrl = (phone: string, text: string) => {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
};

export const CONTACT_PHONE = "+2349132223334"; // Placeholder, user should update
export const BUSINESS_NAME = "E.E IMPORTATION";
