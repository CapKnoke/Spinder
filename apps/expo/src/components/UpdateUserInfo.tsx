import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import useAuth from '../hooks/useAuth';
import { trpc } from '../utils/trpc';
import { useTheme } from '@react-navigation/native';

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
  const { googleUserInfo, setLoading, setUser, setError } = useAuth();
  const { colors } = useTheme();
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
  const { mutate } = trpc.user.updateOrCreate.useMutation({
    onMutate() {
      setLoading(true);
    },
    onSuccess(data) {
      setUser(data);
    },
    onError(err) {
      setError(err);
    },
    onSettled() {
      setLoading(false);
    },
  });
  const onSubmit = (data: IFormInputs) => {
    if (googleUserInfo) {
      mutate({
        ...data,
        email: googleUserInfo.email || 'example@mail.com',
        emailVerified: googleUserInfo.emailVerified || false,
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
              <Text style={{ color: colors.text }} className="text-lg pl-2 mt-4">
                Name
              </Text>
              <TextInput
                style={{ backgroundColor: colors.card, color: colors.text }}
                className="text-lg rounded-sm py-3 px-2"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </>
          )}
          name="displayName"
        />
        {errors.displayName && <Text style={{ color: colors.text }}>Name is required.</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={{ color: colors.text }} className="text-lg pl-2 mt-4">
                Age
              </Text>
              <TextInput
                style={{ backgroundColor: colors.card, color: colors.text }}
                className="text-lg rounded-sm py-3 px-2"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(Number(value))}
                value={value?.toString()}
              />
            </>
          )}
          name="age"
        />
        {errors.age && <Text style={{ color: colors.text }}>Age is required.</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={{ color: colors.text }} className="text-lg pl-2 mt-4">
                Gender
              </Text>
              <Picker
                style={{ backgroundColor: colors.card, color: colors.text }}
                dropdownIconColor={colors.text}
                onValueChange={onChange}
                onBlur={onBlur}
                selectedValue={value}
              >
                <Picker.Item color="#7a7d7b" enabled={false} label="Select" value={undefined} />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
              </Picker>
            </>
          )}
          name="gender"
        />
        {errors.gender && <Text style={{ color: colors.text }}>You must select an option</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={{ color: colors.text }} className="text-lg pl-2 mt-4">
                Interested In
              </Text>
              <Picker
                style={{ backgroundColor: colors.card, color: colors.text }}
                dropdownIconColor={colors.text}
                onValueChange={onChange}
                onBlur={onBlur}
                selectedValue={value}
              >
                <Picker.Item color="#7a7d7b" enabled={false} label="Select" value={undefined} />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
                <Picker.Item label="Both" value="BOTH" />
              </Picker>
            </>
          )}
          name="interestedIn"
        />
        {errors.interestedIn && (
          <Text style={{ color: colors.text }}>You must select an option</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text style={{ color: colors.text }} className="text-lg pl-2 mt-4">
                Bio
              </Text>
              <TextInput
                style={{ backgroundColor: colors.card, color: colors.text }}
                className="text-lg rounded-sm py-3 px-2"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || undefined}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </>
          )}
          name="bio"
        />
      </View>
      <TouchableOpacity
        style={{ backgroundColor: colors.primary }}
        className="rounded-md px-8 py-3"
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={{ color: colors.text }} className="text-center font-bold text-lg">
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateUserInfo;
