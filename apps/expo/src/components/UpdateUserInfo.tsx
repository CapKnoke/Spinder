import { Text, View, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import useAuth from '../hooks/useAuth';
import { trpc } from '../utils/trpc';

interface IUpdateUserInfoProps {
  displayName?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE';
  interestedIn?: 'MALE' | 'FEMALE' | 'BOTH';
  bio?: string | null;
}

const schema = z.object({
  displayName: z.string().min(2).max(32),
  age: z.number().positive().int().min(18).max(120),
  gender: z.enum(['MALE', 'FEMALE']),
  interestedIn: z.enum(['MALE', 'FEMALE', 'BOTH']),
  bio: z.string().optional().nullable(),
});

interface IFormInputs extends z.infer<typeof schema> {}

const UpdateUserInfo: React.FC<IUpdateUserInfoProps> = ({
  displayName,
  age,
  gender,
  interestedIn,
  bio,
}) => {
  const { googleUserInfo, setLoading, setUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: displayName || googleUserInfo?.displayName || '',
      age: age || undefined,
      gender: gender || undefined,
      interestedIn,
      bio,
    },
  });
  const updateUserInfo = trpc.user.updateOrCreate.useMutation({
    onMutate() {
      setLoading(true);
    },
    onSuccess(data) {
      setUser(data);
    },
    onSettled() {
      setLoading(false);
    },
  });
  const onSubmit = (data: IFormInputs) => {
    if (googleUserInfo) {
      updateUserInfo.mutate({
        ...data,
        email: googleUserInfo?.email || 'example@mail.com',
        emailVerified: googleUserInfo?.emailVerified || false,
        id: googleUserInfo.uid,
        bio: data.bio || undefined,
      });
    }
  };
  return (
    <View className="flex flex-col justify-between">
      <View className="flex flex-col pb-8">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="text-lg pl-2">Name</Text>
              <TextInput
                className="border-neutral-400 shadow-md text-lg w-full border rounded-md px-4 py-2 bg-white"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </>
          )}
          name="displayName"
        />
        {errors.displayName && <Text>This is required.</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="text-lg pl-2">Age</Text>
              <TextInput
                className="border-neutral-400 text-lg w-full border rounded-md px-4 py-2 bg-white"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(Number(value))}
                value={value?.toString()}
              />
            </>
          )}
          name="age"
        />
        {errors.age && <Text>This is required.</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="text-lg pl-2">Gender</Text>
              <Picker
                className="border-neutral-400 text-lg w-full border rounded-md px-4 py-2 bg-white"
                onValueChange={onChange}
                onBlur={onBlur}
                selectedValue={value}
              >
                <Picker.Item label="Select" value={undefined} />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
              </Picker>
            </>
          )}
          name="gender"
        />
        {errors.gender && <Text>You must select an option</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="text-lg pl-2">Interested In</Text>
              <Picker
                className="border-neutral-400 shadow-md text-lg w-full border rounded-md px-4 py-2 bg-white"
                onValueChange={onChange}
                onBlur={onBlur}
                selectedValue={value}
              >
                <Picker.Item label="Select" value={undefined} />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
                <Picker.Item label="Both" value="BOTH" />
              </Picker>
            </>
          )}
          name="interestedIn"
        />
        {errors.interestedIn && <Text>You must select an option</Text>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="text-lg pl-2">Bio</Text>
              <TextInput
                className="border-neutral-400 shadow-md text-lg w-full border rounded-md px-4 py-2 bg-white"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || undefined}
                multiline
              />
            </>
          )}
          name="bio"
        />
      </View>
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default UpdateUserInfo;
