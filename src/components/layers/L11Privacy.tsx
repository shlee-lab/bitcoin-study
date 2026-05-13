"use client";

import { LayerShell } from "../LayerShell";
import { Reflection, Probe, Reading, Callout } from "../Reflection";
import { Stepper } from "../Stepper";
import { Term } from "../Term";
import type { LayerProps } from "../LayerStack";

export function L11Privacy(props: LayerProps) {
  return (
    <LayerShell
      id="S13"
      {...props}
      body={
        <div className="max-w-3xl">
          <Stepper
            steps={[
              {
                title: "비트코인은 익명인가",
                subtitle: "공개 장부의 양면",
                body: <Pseudonymous />,
              },
              {
                title: "Chain analysis",
                subtitle: "공개 장부에서 자금 흐름을 따라가는 법",
                body: <ChainAnalysis />,
              },
              {
                title: "일상에서 챙길 수 있는 것",
                subtitle: "고급 기법 없이도 줄일 수 있는 노출",
                body: <BasicHygiene />,
              },
              {
                title: "CoinJoin",
                subtitle: "여러 사람이 하나의 트랜잭션으로 섞기",
                level: "deep",
                body: <CoinJoinSection />,
              },
              {
                title: "Taproot 의 프라이버시 효과",
                subtitle: "단일 / 멀티시그 / 스크립트가 같은 외형",
                level: "deep",
                body: <TaprootPrivacy />,
              },
              {
                title: "Silent Payments",
                subtitle: "BIP352 · 한 주소로 매번 다른 출력",
                level: "deep",
                body: <SilentPayments />,
              },
              {
                title: "프라이버시 코인",
                subtitle: "Zcash와 Monero는 무엇을 다르게 하나",
                level: "case",
                body: <PrivacyCoins />,
              },
              {
                title: "외부 압력",
                subtitle: "Travel Rule, AML, 그리고 거래소 퇴출",
                level: "case",
                body: <RegulatoryPressure />,
              },
              {
                title: "생각해보기",
                subtitle: "강력한 암호화만 있으면 프라이버시는 완전할까?",
                body: <ZKPLimitsReflection />,
              },
              {
                title: "생각해보기",
                subtitle: "Tornado Cash · 코드에 대한 제재",
                body: <TornadoCashReflection />,
              },
            ]}
          />
        </div>
      }
    />
  );
}

function Pseudonymous() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        여기서 말하는 <span className="text-text">가명성 (pseudonymity)</span>
        은 “이름이 보이지 않는다”와 “추적할 수 없다”를 구분하는 개념이다.
        비트코인 주소에는 실명이 직접 적히지 않지만, 주소와 거래 흐름은 공개
        장부 위에 영구히 남고 서로 연결될 수 있다.
      </p>
      <Callout tone="warn" title="현금 vs 비트코인">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          현금은 거래가 발생한 순간 외부 기록이 남지 않는다. 비트코인은
          반대다. 누가 누구에게 보냈는지가 (주소 단위로) 영원히 기록된다.
          체인은 잊지 않는다.
        </p>
      </Callout>
      <p className="text-[14px] text-text/75 leading-[1.7]">
        주소와 실명을 한 번이라도 연결하는 사건이 일어나면 (거래소 KYC,
        누군가에게 주소 공유, 공개 후원 주소 등) 그 시점 이후 그 주소의 모든
        과거·미래 거래가 그 신원에 묶인다. 비트코인의 프라이버시는 ‘기록을
        남기지 않는 것’ 이 아니라{" "}
        <span className="text-text">‘기록을 연결하기 어렵게 만드는 것’</span>
        이 된다.
      </p>
    </section>
  );
}

function ChainAnalysis() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        비트코인은 모든 tx 가 공개된다. 블록 익스플로러에서 주소나 txid 를
        검색하면 input, output, 금액, 수수료, confirmation, 이전 tx 와 다음 tx
        를 볼 수 있다. Chain analysis 는 이 공개 정보 위에서{" "}
        <span className="text-text">돈이 어디서 와서 어디로 갔는지</span> 를
        따라가는 일이다.
      </p>
      <div className="border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>확인할 것</div>
          <div>읽는 방법</div>
        </div>
        <div className="divide-y divide-edge text-[14px]">
          <HRow
            label="주소"
            body="그 주소로 들어온 tx 와 나간 tx 를 시간순으로 본다. 같은 주소를 반복 사용하면 입금 내역이 한 화면에서 묶인다."
          />
          <HRow
            label="tx"
            body="input 은 어떤 UTXO 를 썼는지, output 은 누구에게 얼마를 만들었는지 보여준다. 여기서 자금 흐름의 다음 지점이 생긴다."
          />
          <HRow
            label="change"
            body="송금 후 남은 거스름돈 output 이 새 주소로 돌아가는 경우가 많다. 금액·주소 타입·출력 순서로 추정할 수 있다."
          />
          <HRow
            label="다음 이동"
            body="각 output 이 나중에 어느 tx 의 input 으로 쓰였는지 따라간다. 여러 단계를 넘기면 자금의 경로가 그래프처럼 이어진다."
          />
        </div>
      </div>
      <Callout title="간단한 예">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          Alice 가 1 BTC UTXO 를 써서 Bob 에게 0.3 BTC 를 보내면, tx 에는 보통
          Bob 의 0.3 BTC output 과 Alice 에게 돌아가는 change output 이 같이
          생긴다. 이후 그 change output 이 다른 tx 의 input 으로 쓰이면,
          관찰자는 “이 흐름은 Alice 쪽 자금일 가능성이 높다” 고 추적을
          이어간다.
        </p>
      </Callout>
      <p className="text-[15px] text-text/75 leading-[1.7]">
        여기서부터는 추정이 들어간다. 대표적인 방법은 한 tx 의 여러 input 을
        같은 사용자로 보는 공통 입력 휴리스틱, change output 식별, 거래소
        입출금 주소 태깅, 시간·금액 패턴 비교다. 완벽한 증명은 아니지만,
        평범하게 쓰면 자금 흐름의 많은 부분이 묶인다.
      </p>
      <p className="text-[14px] text-text/65 leading-[1.7]">
        Chainalysis 나 Elliptic 같은 회사들은 이 과정을 대규모로 자동화하고,
        거래소·서비스 주소 라벨과 머신 러닝을 더한다. 다음에 볼 주소 재사용
        회피, coin control, CoinJoin 은 본질적으로{" "}
        <span className="text-text">이 연결 고리를 약하게 만드는 방법</span>
        이다.
      </p>
    </section>
  );
}

function BasicHygiene() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        고급 기법이 아니더라도 일상에서 신경 쓸 수 있는 방법이 몇 가지 있다.
        효과는 제한적이지만, 안 하는 것보다 훨씬 낫다.
      </p>
      <ul className="space-y-3">
        <Hyg
          title="주소 재사용 회피"
          body="입금 받을 때마다 새 주소를 쓴다. 한 주소에 여러 입금이 모이면 ‘공통 출처’ 가 노출된다. 모든 정상 지갑은 자동으로 새 주소를 생성하므로 보통은 그대로 따르면 된다."
        />
        <Hyg
          title="coin control"
          body="송금 시 어떤 UTXO 를 input 으로 쓸지 직접 고른다. ‘KYC 거래소에서 받은 UTXO’ 와 ‘프라이버시 보관 UTXO’ 를 같은 tx 에 섞지 않는다."
        />
        <Hyg
          title="UTXO 분리 (compartmentalization)"
          body="자금의 출처·용도별로 별도의 지갑이나 시드를 둔다. 회계와 프라이버시 모두에 도움이 된다."
        />
        <Hyg
          title="공개 주소 분리"
          body="GitHub README, 트위터 등에 노출한 주소는 영원히 신원과 연결돼 있다고 봐야 한다. 일상 자금과 절대 섞지 않는다."
        />
        <Hyg
          title="VPN 사용"
          body="지갑이나 노드가 tx 를 네트워크에 처음 브로드캐스트할 때 IP 가 단서가 될 수 있다. VPN 을 쓰면 ISP 나 주변 네트워크가 바로 사용자를 보기 어렵고, 외부 노드에는 VPN 서버의 IP 가 보인다."
        />
      </ul>
      <Callout tone="warn" title="VPN 은 프라이버시의 완성품이 아니다">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          VPN 은 체인 위의 주소 연결, change 추정, 거래소 KYC 기록을 지워주지
          않는다. 또 신뢰 지점이 ISP 에서 VPN 사업자로 옮겨갈 뿐이다. VPN
          사업자가 로그를 남기거나 결제 정보와 접속 시간을 묶으면, 오히려 한
          곳에 단서가 모일 수 있다.
        </p>
      </Callout>
    </section>
  );
}

function CoinJoinSection() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        <span className="text-text">CoinJoin</span> 은 여러 사용자의 input 을
        한 tx 에 모으는 협업이다. ‘공통 입력 휴리스틱’ 의 가정이 깨진다. 한
        tx 의 input 들이 더 이상 같은 사람의 것이 아니기 때문이다.
      </p>
      <CoinJoinDiagram />
      <ol className="space-y-2 text-[14px] text-text/85 leading-[1.7] list-none">
        <li>
          <span className="text-muted font-mono text-xs mr-2">①</span> N 명의
          사용자가 자기 input 을 모은다.
        </li>
        <li>
          <span className="text-muted font-mono text-xs mr-2">②</span> 각자
          같은 금액의 output 을 받는다 (예: 0.1 BTC × N).
        </li>
        <li>
          <span className="text-muted font-mono text-xs mr-2">③</span> 외부
          관찰자는 ‘어느 input 이 어느 output 으로 갔는지’ 알 수 없다. 익명
          집합 (anonymity set) 이 N 이 된다.
        </li>
      </ol>
      <div className="border border-edge bg-surface/30 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3 px-4 py-2 border-b border-edge text-[13px] font-semibold text-muted">
          <div>핵심</div>
          <div>왜 필요한가</div>
        </div>
        <div className="divide-y divide-edge">
          <HRow
            label="같은 금액"
            body="출력 금액이 제각각이면 input 과 output 을 금액으로 다시 맞출 수 있다. 그래서 0.1 BTC 처럼 같은 단위의 output 을 여러 개 만든다."
          />
          <HRow
            label="익명 집합"
            body="참여자가 많고 같은 금액 output 이 많을수록 후보가 늘어난다. 익명성은 ‘완전 삭제’가 아니라 ‘가능한 후보 수를 늘리는 것’에 가깝다."
          />
          <HRow
            label="coordinator"
            body="일부 구현은 라운드를 조율하는 서버가 필요하다. coordinator 는 순서를 맞추지만, 설계가 제대로 되어 있으면 사용자의 코인을 훔칠 수는 없다."
          />
          <HRow
            label="사후 관리"
            body="섞은 output 을 다시 한 tx 에 합치거나 KYC 거래소로 바로 보내면 프라이버시 이득이 줄어든다. CoinJoin 뒤의 사용 방식도 중요하다."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <Impl
          name="Wasabi Wallet"
          body="중앙 coordinator 가 라운드를 운영한다. 사용자는 익명으로 input/output 을 등록한다 (Chaumian blind signature). coordinator 도 누가 누구인지 모른다."
        />
        <Impl
          name="JoinMarket"
          body="P2P 시장이다. ‘makers’ 가 유동성을 제공하고 ‘takers’ 가 수수료를 내고 섞는다. 중앙 coordinator 가 없다."
        />
      </div>
      <p className="text-[14px] text-text/65 leading-[1.7]">
        CoinJoin output 은 ‘섞였다’ 는 사실 자체가 외부에 드러난다 (모두 같은
        금액). 일부 거래소는 CoinJoin output 입금을 거부하기도 한다 (S4 의
        fungibility 위협 참고).
      </p>
      <Callout tone="warn" title="CoinJoin 은 마법 세탁기가 아니다">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          CoinJoin 은 공통 입력 휴리스틱을 깨는 강한 도구지만, 금액 패턴,
          타이밍, 재결합, 거래소 KYC, 네트워크 메타데이터까지 모두 지우지는
          않는다. 프라이버시는 도구 하나가 아니라 사용 습관과 함께 만든다.
        </p>
      </Callout>
    </section>
  );
}

function TaprootPrivacy() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        2021 년 활성화된 <Term id="taproot">Taproot</Term> 의 가장 큰
        프라이버시 효과는{" "}
        <span className="text-text">‘외형 통일’</span> 이다. 단일 서명,
        멀티시그, 복잡한 스크립트가 모두 같은 모양의 output 으로 보인다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-edge bg-surface/30 p-5 space-y-2">
          <div className="text-[14px] font-semibold text-muted">
            Taproot 이전
          </div>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            P2PKH (단일 서명), P2SH (멀티시그), P2WSH (스크립트) 가 주소
            형식과 spend 방식에서 외형이 모두 달랐다. ‘이건 멀티시그’,
            ‘이건 Lightning 채널’ 같은 식별이 비교적 쉬웠다.
          </p>
        </div>
        <div className="border border-edge bg-surface/30 p-5 space-y-2">
          <div className="text-[14px] font-semibold text-accent">
            Taproot 이후
          </div>
          <p className="text-[14px] text-text/80 leading-[1.7]">
            모든 spend 가 ‘하나의 Schnorr 서명’ 으로 보인다. 멀티시그도 사전에
            결합되어 단일 서명처럼 등장. Lightning 채널 닫기, MuSig, Taproot
            스크립트가 모두 같은 외형을 가진다.
          </p>
        </div>
      </div>
      <p className="text-[14px] text-text/65 leading-[1.7]">
        ‘이 tx 는 단순 송금인가, Lightning 채널 닫기인가, DAO 의 멀티시그
        해제인가?’ 가 외형만으로는 구분되지 않는다. 모든 Taproot 사용자가 같은
        익명 집합에 들어간다.
      </p>
    </section>
  );
}

function SilentPayments() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        <Term id="bip352">BIP352 · Silent Payments</Term> 는 받는 사람이 정적
        주소 하나를 공개해도, 발신자가 그 주소를 보고{" "}
        <span className="text-text">매번 다른 일회용 output 주소</span> 를
        만들어 보낼 수 있게 한다.
      </p>
      <p className="text-[14px] text-text/75 leading-[1.7]">
        원리 (간략) · 받는 사람의 공개키와 발신자의 nonce 를 결합해 새 주소를
        파생한다. 받는 사람만이 자기 비밀키로 그 출력이 ‘자기 것’ 인지 검사할
        수 있다. 발신자도, 외부 관찰자도 서로 다른 송금들을 한 사람에게 묶을
        수 없다.
      </p>
      <Callout title="왜 강력한가">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          기존 ‘새 주소 매번’ 방식은 받는 쪽이 발신자마다 다른 주소를 공유해야
          했다. 공개 후원 주소 같은 케이스에선 불가능. Silent Payments 는 그
          제약을 푼다. 주소 하나만 공개해도 모든 송금이 서로 다른 출력으로
          분산된다.
        </p>
      </Callout>
      <p className="text-[13px] text-muted leading-[1.7]">
        2024 년 이후 일부 지갑에서 구현이 진행되고 있다. 보편화되려면
        지갑·블록 익스플로러의 지원 확산이 필요하다.
      </p>
    </section>
  );
}

function PrivacyCoins() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        비트코인이 ‘기본 투명, 선택적 프라이버시’ 의 길을 갔다면, ‘기본
        프라이버시’ 를 첫 설계 목표로 잡은 프로젝트들이 있다. 크게 두 갈래로
        나뉜다.
      </p>

      <div className="border border-edge bg-surface/30 p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[16px] font-medium text-text">
            <Term id="zcash">Zcash</Term> ·{" "}
            <Term id="zk-snark">zk-SNARK</Term> 기반
          </h3>
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            2016 ~
          </span>
        </div>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          영지식 증명 (<Term id="zk-snark">zk-SNARK</Term>) 으로 ‘나는 이
          자금을 쓸 권한이 있다’ 만 증명. 발신자·수신자·금액은 모두 가려진다.
        </p>
        <div className="border-l-2 border-edge pl-4 py-1 space-y-1.5">
          <div className="text-[13px] text-text/80 leading-[1.7]">
            ·{" "}
            <span className="text-text">두 가지 주소</span> · t-address (투명,
            비트코인 스타일) vs z-address (shielded, 영지식 보호).
          </div>
          <div className="text-[13px] text-text/80 leading-[1.7]">
            · 실용적 한계 · 대부분의 거래소가 z-address 를 지원하지 않아
            사용자가 결국 t-address 로 옮기게 되고, shielded pool 사용률이
            낮아진다.
          </div>
          <div className="text-[13px] text-text/80 leading-[1.7]">
            ·{" "}
            <span className="text-text">초기 setup</span> 의 신뢰 문제 (
            <Term id="trusted-setup">trusted setup ceremony</Term>) 가 있다.
            setup 데이터가 유출되면 위조가 가능해진다. 최근 버전 (
            <Term id="halo">Halo</Term>) 은 이 신뢰 가정 자체를 없앴다.
          </div>
        </div>
        <div className="text-[13px] text-muted leading-relaxed pt-1">
          학술 출처 · Sasson et al., “Zerocash: Decentralized Anonymous Payments
          from Bitcoin”, IEEE S&P 2014.
        </div>
      </div>

      <div className="border border-edge bg-surface/30 p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[16px] font-medium text-text">
            <Term id="monero">Monero</Term> ·{" "}
            <Term id="ring-signature">Ring signature</Term> +{" "}
            <Term id="stealth-address">Stealth address</Term> +{" "}
            <Term id="ringct">RingCT</Term>
          </h3>
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            2014 ~
          </span>
        </div>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          프라이버시가 옵션이 아니라 기본값이다. 세 가지 메커니즘을 결합한다.
        </p>
        <div className="border-l-2 border-edge pl-4 py-1 space-y-1.5">
          <div className="text-[13px] text-text/80 leading-[1.7]">
            ·{" "}
            <Term id="ring-signature">
              <span className="text-text">Ring signature</span>
            </Term>{" "}
            · 송금 때마다 진짜 input 이 N-1 개의 가짜와 섞인다. 외부엔 그 ring
            중 어느 게 진짜인지 보이지 않는다.
          </div>
          <div className="text-[13px] text-text/80 leading-[1.7]">
            ·{" "}
            <Term id="stealth-address">
              <span className="text-text">Stealth address</span>
            </Term>{" "}
            · 받는 주소가 발신자마다 다르게 일회용으로 파생된다. 수신자가 자기
            비밀키로만 ‘내 것’ 인지 검사 가능.
          </div>
          <div className="text-[13px] text-text/80 leading-[1.7]">
            ·{" "}
            <Term id="ringct">
              <span className="text-text">
                RingCT (Confidential Transactions)
              </span>
            </Term>{" "}
            · 금액 자체가{" "}
            <Term id="pedersen-commitment">Pedersen commitment</Term> 으로
            가려진다. 합이 맞는지는 검증할 수 있지만, 개별 금액은 알 수 없다.
          </div>
        </div>
        <div className="text-[13px] text-muted/85 leading-[1.7] pt-1">
          한계 · 거래 크기가 비트코인의 약 10 배에 이른다.{" "}
          <Term id="chainalysis">Chainalysis</Term> 가 2020 년에 ring 안의 옛
          출력 식별, 시간 상관관계 등 일부 휴리스틱 공격을 발표했다. 그
          이후로 ring 크기를 키우고 decoy 선택 알고리즘을 개선했다.
        </div>
      </div>

      <p className="text-[14px] text-text/75 leading-[1.7]">
        두 프로젝트 모두 기술적으로는 비트코인의 투명성 노선보다 강한
        프라이버시를 제공한다. 그러나 ‘기본 프라이버시’ 라는 선택은 곧 외부의
        반작용을 부른다. 다음 단계에서 본다.
      </p>
    </section>
  );
}

function RegulatoryPressure() {
  return (
    <section className="space-y-5">
      <p className="text-[17px] text-text/85 leading-[1.75]">
        프라이버시 코인의 ‘설계상 추적 불가’ 는 사용자에겐 강점이지만, 금융
        규제 입장에선 자금 세탁 추적이 막힌다는 뜻이기도 하다. 그 충돌이
        제도화된 형태가 <Term id="aml">AML</Term> 과{" "}
        <Term id="travel-rule">Travel Rule</Term>.
      </p>

      <div className="border border-edge bg-surface/30 p-5 space-y-2.5">
        <h3 className="text-[16px] font-medium text-text">
          <Term id="aml">AML · Anti-Money Laundering</Term>
        </h3>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          자금 세탁 방지. 모든 금융 기관이 ‘의심 거래’ 를 정부에 보고하고,
          고객의 신원을 검증·기록하도록 요구하는 규제의 묶음. 1970 년대 미국
          Bank Secrecy Act 이후 전 세계로 확장. 가상자산 거래소도 ‘금융 기관’
          으로 분류되면서 같은 의무가 적용된다.
        </p>
      </div>

      <div className="border border-edge bg-surface/30 p-5 space-y-2.5">
        <h3 className="text-[16px] font-medium text-text">
          <Term id="travel-rule">Travel Rule</Term> · 송수신자 정보 동반 의무
        </h3>
        <p className="text-[14px] text-text/80 leading-[1.7]">
          <Term id="fatf">FATF (Financial Action Task Force)</Term> 가 2019
          년에 발표한 권고 16번이다. 1,000 USD (또는 EUR) 이상의 가상자산
          송금에서,{" "}
          <Term id="vasp">VASP (Virtual Asset Service Provider · 거래소 등)</Term>
          는{" "}
          <span className="text-text">송신자와 수신자의 신원 정보</span> (이름,
          주소, 계좌번호 등) 를 상대 VASP 에 함께 전달해야 한다. 원래 은행간
          wire transfer 의 규정이었던 것을 가상자산에 그대로 적용한 것이다.
        </p>
        <p className="text-[13px] text-text/65 leading-[1.7]">
          EU 의 MiCA, 한국의 특정금융정보법, 미국의 FinCEN 가이드 모두 이 권고를
          국내법으로 흡수했다. 자기 보관 지갑 (unhosted wallet) 으로의 송금에도
          정보 동반을 요구하는 흐름이 강해지고 있다.
        </p>
      </div>

      <Callout tone="warn" title="결과 · 주요 거래소에서 프라이버시 코인 퇴출">
        <p className="text-[14px] text-text/80 leading-[1.7]">
          Travel Rule 을 지키려면 송수신자 정보가 알려져 있어야 한다. 그런데
          Monero 는 그 정보 자체가 프로토콜 수준에서 가려져 있어, 거래소가
          정보를 추출해 보고할 방법이 없다. 결국:
        </p>
        <div className="text-[13px] text-text/75 leading-[1.7] space-y-1 pt-1">
          <div>
            · <span className="text-text">2021 ~ 2024</span> · Bittrex,
            Kraken (영국·유럽), ShapeShift, Huobi 등이 Monero·Zcash·Dash 를
            상장 폐지했다.
          </div>
          <div>
            ·{" "}
            <span className="text-text">2024 년 2 월, Binance</span> 가 Monero,
            Mobilecoin 등 다수를 폐지했다. 글로벌 최대 거래소의 결정이었다.
          </div>
          <div>
            · 결과적으로 프라이버시 코인은 ‘CEX (중앙화 거래소) 에서 사기
            어렵다’ 가 일상이 되었고, DEX·atomic swap 으로만 유통되는 영역으로
            이동했다.
          </div>
        </div>
      </Callout>

      <p className="text-[14px] text-text/65 leading-[1.7]">
        ‘프라이버시’ 라는 기술적 선택이 ‘유동성 차단’ 이라는 시장적 결과로
        되돌아온다. 코드의 자유가 시장 접근성과 만나는 지점이다.
      </p>
    </section>
  );
}

function ZKPLimitsReflection() {
  return (
    <Reflection title="강력한 암호화만 있으면 프라이버시는 완전할까?">
      <p>
        <Term id="zk-snark">zk-SNARK</Term>,{" "}
        <Term id="ring-signature">ring signature</Term>,{" "}
        <Term id="pedersen-commitment">Pedersen commitment</Term> 같은 도구는
        거래의 ‘본질 정보’ (송신자, 수신자, 금액) 를 수학적으로 가린다. 그러나
        그 위에서 프라이버시가 ‘완전’ 한가?
      </p>
      <p>
        그렇지 않다. 본질이 가려져도, 그 거래를 둘러싼{" "}
        <span className="text-text">메타데이터 (metadata)</span> 가 줄줄이 새기
        때문이다. 같은 사용자를 가리키는 단서가 본문이 아니라 ‘본문 밖’ 에
        남는다.
      </p>
      <Callout tone="warn" title="메타데이터로 깨지는 흔한 채널들">
        <div className="text-[13px] text-text/80 leading-[1.7] space-y-1.5 pt-0.5">
          <div>
            ·{" "}
            <span className="text-text">타이밍</span> · ‘5 분 뒤 같은 액수
            출금’, ‘매일 같은 시간 송금’ 같은 입출금 시간의 상관관계만으로도
            동일인이 추정된다.
          </div>
          <div>
            ·{" "}
            <span className="text-text">네트워크 레이어</span> · P2P broadcast
            가 어느 IP 에서 처음 보였는지, 어느 노드를 거쳤는지가 드러난다.
            Tor 를 안 쓰면 IP → ISP → 신원 으로 이어진다.
          </div>
          <div>
            ·{" "}
            <span className="text-text">자금 출처·후속 패턴</span> · ZK 풀에서
            나온 자금이 KYC 거래소로 다시 들어가면 그 시점에 신원과 묶인다.
            출금 뒤 GAS 를 어디서 받았는지도 단서가 된다.
          </div>
          <div>
            ·{" "}
            <span className="text-text">행동 (behavioral)</span> · 사용
            디바이스 지문, 자주 가는 dApp, 거래 시간대, 결제 패턴 같은 비-체인
            정보까지 합쳐 추정한다.
          </div>
          <div>
            ·{" "}
            <span className="text-text">동선 (graph) 결합</span> ·{" "}
            <Term id="chainalysis">Chainalysis</Term> 같은 회사는 다수 체인의
            데이터, 거래소 KYC, 다크웹 leak, OSINT 를 결합해 ‘약한 단서들의
            합’ 으로 사용자를 식별한다.
          </div>
        </div>
      </Callout>
      <p>
        이걸 보면 ‘진정한 프라이버시’ 가 한 가지 강력한 암호 한 겹으로 끝나는
        문제가 아니라는 게 명확해진다. 실용적으로는{" "}
        <span className="text-text">여러 레이어를 동시에 두껍게 쌓아야</span>{" "}
        한다.
      </p>
      <Callout title="프라이버시 = 여러 계층의 곱셈">
        <div className="text-[13px] text-text/80 leading-[1.7] space-y-1.5 pt-0.5">
          <div>
            ·{" "}
            <span className="text-text">암호 레이어</span> · ZK 증명, ring
            signature, stealth address.
          </div>
          <div>
            ·{" "}
            <span className="text-text">네트워크 레이어</span> · Tor / I2P 위
            트랜잭션 브로드캐스트, 분리된 노드.
          </div>
          <div>
            ·{" "}
            <span className="text-text">OPSEC</span> · 타이밍 분리, 별도 device,
            별도 자금 경로, 출금 후 다른 네트워크 사용.
          </div>
          <div>
            ·{" "}
            <span className="text-text">행동</span> · 주소 재사용 회피, 공개
            연결 분리, 인지된 패턴 깨기.
          </div>
        </div>
      </Callout>
      <p>
        한 레이어만 강해도, 다른 레이어가 흘리면 전체가 깨진다. 그래서 실제로
        ‘완전한 프라이버시’ 는{" "}
        <span className="text-text">달성하기 매우 어렵다</span>. 학계·실무가
        실용 목표로 삼는 건 ‘추적 불가능 (untraceable)’ 이 아니라{" "}
        <span className="text-text">‘plausible deniability’</span> 다. 단서가
        남더라도, 그것만으로 어느 한 사람을 단정할 수 없게 만드는 것이다.
      </p>
      <Probe>
        ‘완전한 익명’ 이 환상이라면, ‘충분히 좋은 프라이버시’ 의 기준은
        무엇인가? 일상 결제에서는 ‘은행이 보는 만큼만 가리면 충분’ 일 수 있고,
        내부 고발자에게는 ‘국가 정보 기관도 풀 수 없는 수준’ 이 필요할 수 있다.
        프라이버시 도구의 선택은 곧 자기 위협 모델 (threat model) 의 선언이다.
      </Probe>
      <Reading label="참고 문헌">
        Pfitzmann · Hansen 의{" "}
        <span className="text-text">‘anonymity terminology’ 보고서</span> ·
        unobservability, unlinkability, anonymity, pseudonymity 가 어떻게 서로
        다른 개념인지 정리한 표준 문서.
      </Reading>
      <Reading label="위협 모델 키워드">
        <span className="text-text">‘harvest now, decrypt later’</span> · 지금
        가린 데이터가 미래의 더 강한 분석 (양자 + 더 큰 graph + 추가 leak) 에
        의해 풀릴 가능성. 프라이버시는 ‘오늘’ 만이 아니라 ‘앞으로 수십 년’ 의
        문제.
      </Reading>
    </Reflection>
  );
}

function TornadoCashReflection() {
  return (
    <Reflection title="Tornado Cash · 코드 자체에 대한 제재">
      <p>
        <Term id="tornado-cash">
          <span className="text-text">Tornado Cash</span>
        </Term>{" "}
        는 2019 년에 등장한 이더리움 위의{" "}
        <Term id="zk-snark">zk-SNARK</Term> 기반{" "}
        <Term id="mixer">믹서</Term> 다. 사용자가 ETH 를 컨트랙트에 예치하고,
        일정 시간 뒤 영지식 증명과 함께 다른 주소로 출금하면 입금과 출금이
        외부에선 연결되지 않는다. 비트코인 CoinJoin 의 이더리움 버전, 그러나
        훨씬 강하다.
      </p>
      <p>
        <span className="text-text">2022 년 8 월</span>, 미국 재무부{" "}
        <Term id="ofac">OFAC</Term> 가 Tornado Cash 의 스마트 컨트랙트 주소들을{" "}
        <Term id="sdn-list">SDN</Term> 제재 목록에 직접 추가했다. 즉 미국인이 그
        주소와 상호작용하는 것 자체가 금융 제재 위반이 되었다. 사람도 회사도
        아닌 <span className="text-text">코드 자체에 대한 제재</span> 였고,
        미국 역사상 처음 있는 일이었다.
      </p>
      <p>
        근거로 제시된 건 그 믹서가 북한 Lazarus 그룹의 70 억 달러 가량의 자금
        세탁에 쓰였다는 점이었다. 한쪽엔 ‘프라이버시는 기본권’, 다른 한쪽엔
        ‘이 도구는 실제로 적국의 자금 세탁에 쓰였다’ 가 충돌했다.
      </p>
      <Callout tone="warn" title="후속 충격">
        <div className="text-[13px] text-text/80 leading-[1.7] space-y-1">
          <div>
            · 헌법학자·EFF (Electronic Frontier Foundation) 등이 First
            Amendment (표현의 자유) 위반으로 문제 제기. ‘코드는 표현’ 이라는
            오랜 명제와 충돌.
          </div>
          <div>
            ·{" "}
            <span className="text-text">2024 년 5 월</span> · 개발자 Alexey
            Pertsev 가 네덜란드에서 자금 세탁 방조죄로 5 년 4 개월형을
            선고받았다. 코드 작성자가 그 코드 사용 결과로 형사 처벌을 받은 첫
            사례 중 하나다.
          </div>
          <div>
            ·{" "}
            <span className="text-text">2024 년 11 월</span> · 미국 5th Circuit
            항소법원이 Van Loon v. Treasury 에서 OFAC 의 컨트랙트 주소 제재가
            ‘재산권 (property)’ 이 없는 자율 실행 코드에는 적용되지 않는다고
            판결했다.
          </div>
          <div>
            ·{" "}
            <span className="text-text">2025 년 3 월</span> · OFAC 가 Tornado
            Cash 관련 스마트 컨트랙트 주소를 SDN 리스트에서 제거했다. 다만
            개발자 형사 사건은 별개로 남았고, Roman Storm 은 2025 년 8 월
            무허가 자금 송금업 공모 혐의에서 유죄 평결을 받았다. 배심원은 자금
            세탁·제재 위반 공모 혐의에는 합의하지 못했다.
          </div>
        </div>
      </Callout>
      <Probe>
        <span className="text-text">코드는 표현인가, 도구인가?</span> 누군가가
        만든 자율 실행 코드가 그 사용 결과로 작성자의 형사 책임이 되는 게
        정당한가? ‘자유로운 코드 작성’ 의 한계는 어디인가? 만약 작성자가 그
        코드의 사용자를 통제할 수단이 없다면 ‘방조’ 라는 개념이 성립하는가?
      </Probe>
      <Reading label="법적 쟁점">
        Coin Center, Electronic Frontier Foundation 의 법정 의견서.{" "}
        <span className="text-text">Privacy Pools</span> (Vitalik Buterin
        et al., 2023) · 합법적 자금만 모인 ZK 풀을 만들어 ‘프라이버시 + 합법성
        증명’ 을 동시에 제공하려는 후속 시도. 같은 방향의 다른 프로젝트로 zkBob.
      </Reading>
      <Reading label="관련 사례">
        비트코인 쪽 사례 · Samourai Wallet 개발자 두 명이 2024 년 4 월 미국에서
        무허가 자금 송금업 운영 + 자금 세탁 방조 혐의로 체포되었고, 2025 년에는
        관련 혐의 일부에 대해 유죄를 인정했다. Wasabi Wallet 의 미국 coordinator
        종료까지 이어지며, ‘프라이버시 ↔ 법적 위험’ 충돌이 비트코인 생태계에도
        같은 모양으로 나타났다.
      </Reading>
    </Reflection>
  );
}

function HRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3 px-4 py-2.5 items-baseline">
      <div className="font-mono text-[13px] text-accent2/80">{label}</div>
      <div className="text-[13px] text-text/85 leading-relaxed">{body}</div>
    </div>
  );
}

function Hyg({ title, body }: { title: string; body: string }) {
  return (
    <li className="border-l-2 border-edge pl-4">
      <div className="text-[15px] font-medium text-text mb-1">{title}</div>
      <div className="text-[14px] text-text/75 leading-[1.7]">{body}</div>
    </li>
  );
}

function Impl({ name, body }: { name: string; body: string }) {
  return (
    <div className="border border-edge bg-surface/30 p-4 space-y-1.5">
      <div className="text-[14px] font-medium text-accent">{name}</div>
      <div className="text-[13px] text-text/75 leading-[1.7]">{body}</div>
    </div>
  );
}

function CoinJoinDiagram() {
  return (
    <div className="border border-edge bg-surface/30 p-4">
      <svg
        viewBox="0 0 460 180"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {[40, 70, 100, 130].map((y, i) => (
          <g key={`i${i}`}>
            <rect
              x={20}
              y={y - 8}
              width={70}
              height={16}
              fill="none"
              stroke="#5b8def"
              strokeWidth="1"
            />
            <text
              x={55}
              y={y + 3}
              textAnchor="middle"
              fontSize="10"
              fill="#aaa"
              fontFamily="JetBrains Mono"
            >
              user {i + 1}
            </text>
          </g>
        ))}
        {[40, 70, 100, 130].map((y, i) => (
          <line
            key={`li${i}`}
            x1={90}
            y1={y}
            x2={185}
            y2={68 + i * 14}
            stroke="#2a2f3a"
            strokeDasharray="2 2"
          />
        ))}
        <rect
          x={185}
          y={50}
          width={90}
          height={80}
          fill="none"
          stroke="#f7931a"
          strokeWidth="1.2"
        />
        <text
          x={230}
          y={86}
          textAnchor="middle"
          fontSize="11"
          fill="#f7931a"
          fontFamily="JetBrains Mono"
        >
          CoinJoin tx
        </text>
        <text
          x={230}
          y={102}
          textAnchor="middle"
          fontSize="10"
          fill="#7a8190"
          fontFamily="JetBrains Mono"
        >
          4 in / 4 out
        </text>
        {[40, 70, 100, 130].map((y, i) => (
          <line
            key={`lo${i}`}
            x1={275}
            y1={68 + i * 14}
            x2={370}
            y2={y}
            stroke="#2a2f3a"
            strokeDasharray="2 2"
          />
        ))}
        {[40, 70, 100, 130].map((y, i) => (
          <g key={`o${i}`}>
            <rect
              x={370}
              y={y - 8}
              width={70}
              height={16}
              fill="none"
              stroke="#5b8def"
              strokeWidth="1"
            />
            <text
              x={405}
              y={y + 3}
              textAnchor="middle"
              fontSize="10"
              fill="#aaa"
              fontFamily="JetBrains Mono"
            >
              0.1 BTC
            </text>
          </g>
        ))}
      </svg>
      <div className="text-[12px] text-muted/85 mt-2 leading-relaxed">
        N 명의 input 이 한 tx 로 합쳐지고, 모두 같은 금액의 output 을 받는다.
        외부에서는 어느 input 이 어느 output 으로 갔는지 알 수 없다.
      </div>
    </div>
  );
}
