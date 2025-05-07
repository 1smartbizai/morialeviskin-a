
import { Message } from '@/types/messaging';
import { Clock, Send, Check, CheckCheck, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

export const getStatusIcon = (status: Message['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />;
    case 'sent':
      return <Send className="h-4 w-4 text-blue-500" />;
    case 'delivered':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'read':
      return <CheckCheck className="h-4 w-4 text-green-700" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

export const getStatusLabel = (status: Message['status']) => {
  const labels = {
    pending: 'ממתין',
    sent: 'נשלח',
    delivered: 'נמסר',
    read: 'נקרא',
    failed: 'נכשל'
  };
  return labels[status] || status;
};

export const getStatusColor = (status: Message['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'read':
      return 'bg-green-700 text-white';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return '';
  }
};

export const getChannelLabel = (channel: 'whatsapp' | 'sms' | 'in-app') => {
  const labels = {
    whatsapp: 'וואטסאפ',
    sms: 'SMS',
    'in-app': 'באפליקציה'
  };
  return labels[channel] || channel;
};

export const formatTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: he });
  } catch (e) {
    return dateString;
  }
};
