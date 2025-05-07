import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmotionalLog } from '@/types/client-management';
import { formatDistanceToNow } from 'date-fns';

interface EmotionalLogItemProps {
  log: EmotionalLog;
}

export const EmotionalLogItem: React.FC<EmotionalLogItemProps> = ({ log }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div>
            <h4 className="text-sm font-medium">{log.client?.first_name} {log.client?.last_name}</h4>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: require('date-fns/locale/he') })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{log.content}</p>
        {log.tags && log.tags.length > 0 && (
          <div className="flex mt-2 space-x-1 rtl:space-x-reverse">
            {log.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[0.7rem]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end items-center">
        {log.sentiment && (
          <Badge variant="outline">
            {log.sentiment}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};
