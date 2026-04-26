"use client";

import {
  ImageIcon,
  LegendDescription,
  LegendHeader,
  LegendTextContainer,
  LegendTypeContainer,
  StyledLegend,
} from "./styles";

export default function LegendCard() {
  return (
    <StyledLegend>
      <LegendTypeContainer>
        <ImageIcon src="/images/A_tree.svg" alt="Type A" />
        <LegendTextContainer>
          <LegendHeader>Type A</LegendHeader>
          <LegendDescription>
            No training required. Waters trees at properties with onsite water.
          </LegendDescription>
        </LegendTextContainer>
      </LegendTypeContainer>

      <LegendTypeContainer>
        <ImageIcon src="/images/B_water.svg" alt="Type B" />
        <LegendTextContainer>
          <LegendHeader>Type B</LegendHeader>
          <LegendDescription>
            Waters trees at properties with nearby fire hydrant. Requires
            firehose.
          </LegendDescription>
        </LegendTextContainer>
      </LegendTypeContainer>

      <LegendTypeContainer>
        <ImageIcon src="/images/C_truck.svg" alt="Type C" />
        <LegendTextContainer>
          <LegendHeader>Type C</LegendHeader>
          <LegendDescription>
            Truck with 150 gallons. For properties without onsite water or
            nearby hydrant.
          </LegendDescription>
        </LegendTextContainer>
      </LegendTypeContainer>

      <LegendTypeContainer>
        <ImageIcon src="/images/D_truck.svg" alt="Type D" />
        <LegendTextContainer>
          <LegendHeader>Type D</LegendHeader>
          <LegendDescription>
            Contractor with 2000-gallon truck. Amigos team drives alongside
            contractor.
          </LegendDescription>
        </LegendTextContainer>
      </LegendTypeContainer>
    </StyledLegend>
  );
}
