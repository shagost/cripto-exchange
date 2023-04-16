import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import ImageWithFallback from './components/ImageWithFallback';

const HeaderDivStyled = styled.div`
  width: 100%;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
`;

const DivFiltroStyled = styled.div`
  display: flex;
  padding: 0px 16px;
  margin-top: 18px;
  justify-content: center;
`;

const InputTextStyled = styled.input`
  width: 100%;
  height: 42px;
  padding: 0px 12px;
`;

const H3Styled = styled.h3`
  display: flex;
  align-items: center;
`;

const UlStyled = styled.ul`
  padding: 0;
  list-style: none;
`;

const ButtonStyled = styled.button`
  background-color: transparent;
  border: 1px solid black;
  border-radius: 5px;
  padding: 12px;
  margin: 16px 16px;
`;

const LiStyled = styled.li`
  padding: 1rem;
  background-color: lightgrey;
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem;
`;

const SpanStyled1 = styled.span`,
  box-sizing: border-box;
  display: inline-block;
  overflow: hidden;
  width: initial;
  height: initial;
  background: none;
  opacity: 1;
  border: 0px;
  margin: 0px;
  padding: 0px;
  position: relative;
  max-width: 100%;
`;

const SpanStyled2 = styled.span`,
  box-sizing: border-box;
  display: block;
  width: initial;
  height: initial;
  background: none;
  opacity: 1;
  border: 0px;
  margin: 0px;
  padding: 0px;
  max-width: 100%;
`;

interface ExchangeModel {
  id: string;
  name: string;
  image: string;
  year_established: Number;
  country: string;
  trust_score: Number;
  trade_volume_24h_btc: Number;
}

export default function Home() {
  const elementRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<(ExchangeModel | undefined)[]>([]);
  const [page, setPage] = useState(1);
  const [previous, setPrevious] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const [filteredData, setFilteredData] = useState<
    (ExchangeModel | undefined)[]
  >([]);
  const itemsByPage = 100;
  let pageBefore = 0;
  let datalen = 0;

  const loadData = async () => {
    if (page !== pageBefore)
      fetch(
        `https://api.coingecko.com/api/v3/exchanges?per_page=${itemsByPage}&page=${page}`
      )
        .then(resp => resp.json())
        .then(jsonData => {
          const dados: (ExchangeModel | undefined)[] = jsonData.map(
            (x: ExchangeModel) => ({
              id: x.id,
              name: x.name,
              image: x.image,
              year_established: x.year_established,
              country: x.country,
              trust_score: x.trust_score,
              trade_volume_24h_btc: x.trade_volume_24h_btc,
            })
          );
          datalen = dados.length;
          setData(dados);
          setFilteredData(dados);
          changePage(page);
        });
  };

  useEffect(() => {
    async function load() {
      await loadData();
    }
    load().then(() => changePage(page));
  }, [page]);

  const changePage = (pageNum: number) => {
    setPrevious(pageNum === 1 ? true : false);
    setNext(datalen < itemsByPage ? true : false);
    console.log('pageNum', pageNum);
  };

  const handleClickNext = () => {
    pageBefore = page;
    elementRef.current!.value = '';
    setPage(page + 1);
  };

  const handleClickPrev = () => {
    pageBefore = page;
    elementRef.current!.value = '';
    setPage(page - 1);
  };

  const filterData = (exchangeName: string) => {
    if (exchangeName !== '') {
      const filtered = data.filter(
        objeto => objeto!.name.toLowerCase().indexOf(exchangeName) !== -1
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleChange = (exchangeName: string) => {
    filterData(exchangeName.toLocaleLowerCase());
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <HeaderDivStyled>
          <ButtonStyled disabled={previous} onClick={handleClickPrev}>
            Página anterior
          </ButtonStyled>
          <ButtonStyled disabled={next} onClick={handleClickNext}>
            Próxima página
          </ButtonStyled>
        </HeaderDivStyled>
        <DivFiltroStyled>
          <InputTextStyled
            ref={elementRef}
            onChange={e => handleChange(e.target.value)}
            placeholder="Filtre por nome"
          />
        </DivFiltroStyled>
        <UlStyled>
          {!filteredData && <div>Sem resultados</div>}
          {filteredData &&
            filteredData.map(x => {
              return (
                <LiStyled key={x?.id}>
                  <H3Styled>
                    <SpanStyled1>
                      <SpanStyled2>
                        <ImageWithFallback
                          src={x?.image}
                          alt={x?.name}
                          width={50}
                          height={50}
                        />
                      </SpanStyled2>
                    </SpanStyled1>
                    <div style={{ marginLeft: '8px' }}>{x?.name}</div>
                  </H3Styled>
                  <div>
                    Ano da criação:{' '}
                    <strong>{x?.year_established?.toString()}</strong>
                  </div>
                  <div>
                    País: <strong>{x?.country}</strong>
                  </div>
                  <div>
                    Pontuação: <strong>{x?.trust_score?.toString()}</strong>
                  </div>
                  <div>
                    Volume de trade (24 horas):{' '}
                    <strong>{x?.trade_volume_24h_btc?.toString()}</strong>
                  </div>
                </LiStyled>
              );
            })}
        </UlStyled>
      </main>
    </div>
  );
}
