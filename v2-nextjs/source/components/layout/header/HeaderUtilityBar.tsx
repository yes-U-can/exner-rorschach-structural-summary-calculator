'use client';

type HeaderUtilityBarProps = {
  introLine1: string;
  introLine2: string;
};

export default function HeaderUtilityBar({
  introLine1,
  introLine2,
}: HeaderUtilityBarProps) {
  return (
    <div className="ui-header-utility">
      <p className="ui-header-intro">
        <span className="block">{introLine1}</span>
        <span className="block">{introLine2}</span>
      </p>
    </div>
  );
}
