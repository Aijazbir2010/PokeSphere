import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "PokeSphere" },
    { name: "description", content: "Explore the captivating world of Pokémon with PokeSphere!" },
  ];
};

export default function Index() {
  return (
    <>

    </>
  );
}

