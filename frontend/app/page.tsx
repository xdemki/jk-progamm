"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Checkbox, Form, Input, notification, Spin } from "antd";
import Home from "@/components/Home/Home";

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

export default function LoginPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification(); // ✅ create instance

  const onFinish = async (values: any) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    });
    setLoading(false);

    if (result?.error) {
      api.error({
        message: "Login fehlgeschlagen",
        description: "Ungültige Anmeldedaten. Bitte erneut versuchen.",
        placement: "topRight",
      });
    } else if (result?.ok && !result.error) {
      api.success({
        message: "Login erfolgreich",
        description: "Willkommen zurück!",
        placement: "topRight",
      });
    }
  };

  if (session) {
    return (
      <div className="p-4">
        {contextHolder} {/* ✅ important: render notification context */}
        <Home />
      </div>
    );
  }

  if(loading) {
    return (
      <Spin />
    )
  }

  return (
    <div className="p-4">
      {contextHolder} {/* ✅ important: render notification context */}
      <Form<FieldType>
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Bitte Benutzernamen eingeben!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Passwort"
          name="password"
          rules={[{ required: true, message: "Bitte Passwort eingeben!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
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