import { Card, Skeleton } from "@nextui-org/react";

export default function VideoCardSkeleton() {
  return (
    <Card className=" w-full space-y-2 bg-transparent" radius="lg">
      <Skeleton className="h-48 rounded-xl">
        <div className="h-full rounded-lg bg-white"></div>
      </Skeleton>
      <div className="flex flex-col justify-between gap-2 py-1 space-y-2">
        <div className="space-y-3">
          <Skeleton className="w-full rounded-lg">
            <div className="h-3 w-full rounded-lg bg-white"></div>
          </Skeleton>
          <Skeleton className="w-full rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-white"></div>
          </Skeleton>
        </div>
        <div className="flex gap-2">
          <div>
            <Skeleton className="w-[40px] rounded-full">
              <div className="h-[40px] w-[40px] bg-white"></div>
            </Skeleton>
          </div>
          <div className="w-1/2 rounded-full">
            <Skeleton className="w-full rounded-full mb-2">
              <div className="h-3 w-full rounded-full bg-white"></div>
            </Skeleton>
            <Skeleton className="w-1/2 rounded-full">
              <div className="h-3 w-full rounded-full bg-white"></div>
            </Skeleton>
          </div>
        </div>
      </div>
    </Card>
  );
}
