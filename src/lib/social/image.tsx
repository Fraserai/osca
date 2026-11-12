import { ImageResponse } from 'next/og';
import { getRiskLabel, getRiskTone, getSimpleRiskScore } from '@/lib/oscaIndex';
import { designTokens } from '@/lib/design/tokens';
import { DATA_LAST_UPDATED_LABEL, DATASET_VERSION_LABEL, SITE_TITLE } from '@/lib/site';
import { getRoleMetadataDescription } from '@/lib/roles/narrative';
import type { Role } from '@/types/role';

export const socialImageSize = {
  width: 1200,
  height: 630
};

export const socialImageContentType = 'image/png';

function getRoleTitleSize(title: string): number {
  if (title.length > 54) return 46;
  if (title.length > 40) return 54;
  if (title.length > 26) return 62;
  return 72;
}

export function createSiteSocialImageResponse() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: designTokens.colors.canvas,
          color: designTokens.colors.textPrimary,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 16% 16%, rgba(29,78,216,0.14), transparent 28%), radial-gradient(circle at 84% 20%, rgba(217,119,6,0.16), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.7), rgba(248,250,252,0.9))'
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '54px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                borderRadius: '999px',
                border: `1px solid ${designTokens.colors.border}`,
                background: designTokens.colors.surface,
                padding: '10px 16px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '18px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: designTokens.colors.textSecondary
              }}
            >
              {DATASET_VERSION_LABEL}
            </div>
            <div
              style={{
                display: 'flex',
                borderRadius: '18px',
                background: designTokens.colors.surface,
                border: `1px solid ${designTokens.colors.border}`,
                padding: '14px 18px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '24px',
                color: designTokens.colors.textPrimary
              }}
            >
              1,156 occupations
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '840px' }}>
            <div style={{ display: 'flex', fontSize: '74px', lineHeight: 0.94, fontFamily: 'Georgia, serif', fontWeight: 700 }}>{SITE_TITLE}</div>
            <div
              style={{
                display: 'flex',
                fontFamily: '"Avenir Next", "Helvetica Neue", sans-serif',
                fontSize: '28px',
                lineHeight: 1.4,
                color: designTokens.colors.textSecondary
              }}
            >
              Search Australian jobs, see a simple 1-10 AI risk score, and review which tasks already look exposed.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              {[
                ['At risk', '#DC2626'],
                ['Safer for now', '#16A34A']
              ].map(([label, color]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '999px',
                    border: `1px solid ${designTokens.colors.border}`,
                    padding: '10px 14px',
                    background: designTokens.colors.surface,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '18px',
                    color: designTokens.colors.textSecondary
                  }}
                >
                  <div style={{ display: 'flex', width: '10px', height: '10px', borderRadius: '999px', background: color }} />
                  {label}
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '18px',
                color: designTokens.colors.textSecondary
              }}
            >
              <div style={{ display: 'flex' }}>Last updated {DATA_LAST_UPDATED_LABEL}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    socialImageSize
  );
}

export function createRoleSocialImageResponse(role: Role) {
  const tone = getRiskTone(role.score);
  const titleFontSize = getRoleTitleSize(role.title);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: designTokens.colors.canvas,
          color: designTokens.colors.textPrimary,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 16% 12%, rgba(29,78,216,0.16), transparent 30%), radial-gradient(circle at 84% 18%, rgba(217,119,6,0.16), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.78), rgba(248,250,252,0.94))'
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '46px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '760px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '18px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: designTokens.colors.textSecondary
                }}
              >
                <span>{DATASET_VERSION_LABEL}</span>
                <span>OSCA {role.code}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Georgia, serif',
                  fontSize: `${titleFontSize}px`,
                  lineHeight: 0.94,
                  fontWeight: 700,
                  maxWidth: '100%'
                }}
              >
                {role.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontFamily: '"Avenir Next", "Helvetica Neue", sans-serif',
                  fontSize: '24px',
                  lineHeight: 1.35,
                  color: designTokens.colors.textSecondary,
                  maxWidth: '760px'
                }}
              >
                {getRoleMetadataDescription(role)}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '14px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  borderRadius: '22px',
                  background: tone.fill,
                  color: tone.text,
                  padding: '18px 22px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '40px',
                  fontWeight: 700
                }}
              >
                {getSimpleRiskScore(role.score)}
              </div>
              <div
                style={{
                  display: 'flex',
                  borderRadius: '999px',
                  border: `1px solid ${tone.border}`,
                  background: tone.tint,
                  color: tone.fill,
                  padding: '10px 16px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em'
                }}
              >
                {getRiskLabel(role.score)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '14px'
            }}
          >
            {[
              ['Status', getRiskLabel(role.score)],
              ['At risk now', `${role.taskAutomationCount}/${role.taskAssessments.length}`],
              ['Still human', `${role.taskAssessments.length - role.taskAutomationCount}/${role.taskAssessments.length}`]
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '220px',
                  borderRadius: '22px',
                  border: `1px solid ${designTokens.colors.border}`,
                  background: designTokens.colors.surface,
                  padding: '18px 20px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '16px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: designTokens.colors.textTertiary
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontFamily: '"Avenir Next", "Helvetica Neue", sans-serif',
                    fontSize: '28px',
                    color: designTokens.colors.textPrimary
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div
              style={{
                display: 'flex',
                maxWidth: '800px',
                borderRadius: '24px',
                border: `1px solid ${designTokens.colors.border}`,
                background: designTokens.colors.surface,
                padding: '18px 22px',
                fontFamily: '"Avenir Next", "Helvetica Neue", sans-serif',
                fontSize: '22px',
                lineHeight: 1.4,
              color: designTokens.colors.textSecondary
            }}
          >
              {getRoleMetadataDescription(role)}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '18px',
                color: designTokens.colors.textSecondary
              }}
            >
              <div style={{ display: 'flex' }}>{SITE_TITLE}</div>
              <div style={{ display: 'flex' }}>Last updated {DATA_LAST_UPDATED_LABEL}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    socialImageSize
  );
}
