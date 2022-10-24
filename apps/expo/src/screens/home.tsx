import * as React from 'react';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@acme/api';

import { trpc } from '../utils/trpc';
import useAuth from '../hooks/useAuth';

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter['post']['all']>[number];
}> = ({ post }) => {
  return (
    <View className="p-4 border-2 border-gray-500 rounded-lg">
      <Text className="text-xl font-semibold text-gray-800">{post.title}</Text>
      <Text className="text-gray-600">{post.content}</Text>
    </View>
  );
};

const CreatePost: React.FC = () => {
  const utils = trpc.useContext();
  const { mutate } = trpc.post.create.useMutation({
    async onSuccess() {
      await utils.post.all.invalidate();
    },
  });

  const [title, onChangeTitle] = React.useState('');
  const [content, onChangeContent] = React.useState('');

  return (
    <View className="p-4 border-t-2 border-gray-500 flex flex-col">
      <TextInput
        className="border-2 border-gray-500 rounded p-2 mb-2"
        onChangeText={onChangeTitle}
        placeholder="Title"
      />
      <TextInput
        className="border-2 border-gray-500 rounded p-2 mb-2"
        onChangeText={onChangeContent}
        placeholder="Content"
      />
      <TouchableOpacity
        className="bg-indigo-500 rounded p-2"
        onPress={() => {
          mutate({
            title,
            content,
          });
        }}
      >
        <Text className="text-white font-semibold">Publish post</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const postQuery = trpc.post.all.useQuery();
  const [showPost, setShowPost] = React.useState<string | null>(null);
  const { logout, error } = useAuth();

  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="text-5xl font-bold mx-auto p-2">Tinder/Spotify clone</Text>
        <View className="py-2">
          <Button title="Log out" onPress={() => logout()} />
        </View>
        <View className="py-2">
          {showPost ? (
            <Text>
              <Text className="font-semibold">Selected post:</Text>
              {showPost}
            </Text>
          ) : (
            <Text className="italic font-semibold">Press on a post</Text>
          )}
          {error ? (
            <>
              <Text>Error:</Text>
              <Text>{error.message}</Text>
            </>
          ) : null}
        </View>
        <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setShowPost(item.id)}>
              <PostCard post={item} />
            </TouchableOpacity>
          )}
        />
        <CreatePost />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
