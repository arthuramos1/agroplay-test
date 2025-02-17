import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

import { PrismaClient } from "@prisma/client";

const PORT = 3001;
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/events", async (_, res) => {
  const events = await prisma.event.findMany();
  res.status(200).json(events);
});

// private route get event
app.get("/events-auth", getToken, async (_, res) => {
  const events = await prisma.event.findMany();
  res.status(200).json(events);
});

app.post("/events", async (req, res) => {
  await prisma.event.create({
    data: req.body,
  });

  res.status(201).json(req.body);
});

app.put("/events/:id", async (req, res) => {
  await prisma.event.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.status(201).json(req.body);
});

app.delete("/events/:id", async (req, res) => {
  await prisma.event.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(201).json({ message: "Evento deletado." });
});

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ message: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ message: "A senha é obrigatória!" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(422).json({ message: "Email ou Senha incorretos" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(422).json({ message: "Email ou Senha incorretos" });
  }

  try {
    const secret = process.env.SECRET_JWT;

    const token = jwt.sign(
      {
        id: user.id,
      },
      secret
    );

    res.status(200).json({ message: "Auth ok!", token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

function getToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
