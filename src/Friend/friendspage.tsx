import React, { useState, useEffect } from "react";

const FriendsPage: React.FC = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const loadFriends = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        try {
          const response = await fetch(`http://localhost:8080/user/${user.username}/friends`);
          if (!response.ok) {
            throw new Error("Failed to load friends");
          }
          const data = await response.json();
          setFriends(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error loading friends:", error);
          setFriends([]);
        }
      }
    };
    loadFriends();
  }, []);

  const handleSearch = async (): Promise<void> => {
    if (searchQuery.trim() === "") return;
    const response = await fetch(`http://localhost:8080/user/search?query=${searchQuery}`);
    const results = await response.json();
    setSearchResults(results);
  };

  const handleAddFriend = async (friendUsername: string): Promise<void> => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      await fetch(`http://localhost:8080/user/addFriend?username=${user.username}&friendUsername=${friendUsername}`, {
        method: "POST",
      });
      setFriends((prevFriends) => [...prevFriends, { username: friendUsername }]);
    }
  };

  const handleRemoveFriend = async (friendUsername: string): Promise<void> => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      await fetch(`http://localhost:8080/user/removeFriend?username=${user.username}&friendUsername=${friendUsername}`, {
        method: "POST",
      });
      setFriends((prevFriends) => prevFriends.filter((friend) => friend.username !== friendUsername));
    }
  };

  return (
    <div>
      <h2>Friends Page</h2>
      <input
        type="text"
        placeholder="Search for users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <h3>Your Friends</h3>
      <ul>
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.username}>
              {friend.username}
              <button onClick={() => handleRemoveFriend(friend.username)}>Remove</button>
            </li>
          ))
        ) : (
          <li>No friends found.</li>
        )}
      </ul>

      <h3>Search Results</h3>
      <ul>
        {searchResults.map((result) => (
          <li key={result.username}>
            {result.username}
            <button onClick={() => handleAddFriend(result.username)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsPage;
