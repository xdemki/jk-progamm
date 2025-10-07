"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Checkbox, Form, Input, message } from "antd";

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

export default function LoginPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FieldType) => {
    setLoading(true);
    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    if (res?.ok) {
      message.success("Login erfolgreich!");
    } else {
      message.error("Login fehlgeschlagen.");
    }
    setLoading(false);
  };

  if (session) {
    return (
      <div className="p-4">
        <p>Angemeldet als {session.user?.username}</p>
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Form
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Bitte Benutzernamen eingeben!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Passwort"
          name="password"
          rules={[{ required: true, message: "Bitte Passwort eingeben!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox>Angemeldet bleiben</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
