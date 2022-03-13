export const Chat = ({ partnerId, messages }) => {
  const hasMessages = messages?.length > 0;

  return (
    <div className="p-6 overflow-y-auto flex-grow">
      {hasMessages ? (
        <div className="flex flex-col gap-4">
          {messages.map((item) => {
            const isOwn = item.to_userId === partnerId;
            return (
              <div key={item._id} className="flex flex-col gap-2">
                <div
                  className={`${
                    isOwn ? "ml-auto bg-gray-100" : "bg-orange-100"
                  } p-4 shadow rounded-lg`}
                >
                  {item.message}
                </div>
                <small
                  className={`${isOwn ? "ml-auto" : undefined} text-gray-400`}
                >
                  {item.timestamp}
                </small>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center">Send your first message</div>
      )}
    </div>
  );
};
